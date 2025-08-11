// API para la interacción con Firebase y Firestore
// Proporciona funciones para la gestión de datos financieros en Firestore

/**
 * API de Firebase para Control Financiero
 * Proporciona funciones para interactuar con Firestore y Firebase Auth
 */
class FirebaseAPI {
  constructor() {
    this.db = null;
    this.auth = null;
    this.user = null;
    this.initialized = false;
  }

  /**
   * Inicializa la API de Firebase
   * @returns {Promise} Promesa que se resuelve cuando Firebase está listo
   */
  async init() {
    try {
      console.log("🔄 Inicializando Firebase API...");

      // Inicializar Firebase si no está inicializado
      if (!window.FIREBASE.isInitialized()) {
        await window.FIREBASE.init();
      }

      // Obtener instancias de Firestore y Auth
      this.db = window.FIREBASE.getFirestore();
      this.auth = window.FIREBASE.getAuth();

      // Verificar si hay un usuario autenticado
      this.user = this.auth.currentUser;

      // Configurar escucha de cambios de autenticación
      this.auth.onAuthStateChanged((user) => {
        this.user = user;
        console.log(
          user ? "👤 Usuario autenticado" : "👤 No hay usuario autenticado"
        );
      });

      this.initialized = true;
      console.log("✅ Firebase API inicializada");

      return true;
    } catch (error) {
      console.error("❌ Error al inicializar Firebase API:", error);
      throw error;
    }
  }

  /**
   * Obtiene la referencia a la colección de un usuario
   * @param {string} collection - Nombre de la colección
   * @returns {FirebaseFirestore.CollectionReference} Referencia a la colección
   * @private
   */
  _getUserCollection(collection) {
    if (!this.user) {
      throw new Error("No hay usuario autenticado");
    }
    return this.db
      .collection("usuarios")
      .doc(this.user.uid)
      .collection(collection);
  }

  /**
   * Verifica si la API está inicializada y el usuario autenticado
   * @throws {Error} Si la API no está inicializada o no hay usuario autenticado
   * @private
   */
  _checkInitAndAuth() {
    if (!this.initialized) {
      throw new Error("Firebase API no está inicializada");
    }
    if (!this.user) {
      throw new Error("No hay usuario autenticado");
    }
  }

  // =================================================================
  // AUTENTICACIÓN
  // =================================================================

  /**
   * Registra un nuevo usuario con correo y contraseña
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @param {string} displayName - Nombre a mostrar
   * @returns {Promise<Object>} Información del usuario creado
   */
  async registrarUsuario(email, password, displayName) {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Actualizar el perfil del usuario con el nombre
      await result.user.updateProfile({
        displayName: displayName,
      });

      // Crear documento de usuario
      await this.db
        .collection("usuarios")
        .doc(result.user.uid)
        .set({
          email: email,
          displayName: displayName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          configuracion: {
            moneda: "PEN",
            tema: "light",
            notificaciones: true,
          },
        });

      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName,
      };
    } catch (error) {
      console.error("❌ Error al registrar usuario:", error);
      throw error;
    }
  }

  /**
   * Inicia sesión con correo y contraseña
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Información del usuario
   */
  async iniciarSesion(email, password) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      };
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      throw error;
    }
  }

  /**
   * Inicia sesión con Google
   * @returns {Promise<Object>} Información del usuario
   */
  async iniciarSesionConGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.auth.signInWithPopup(provider);

      // Verificar si es un usuario nuevo para crear su documento
      const userDoc = await this.db
        .collection("usuarios")
        .doc(result.user.uid)
        .get();

      if (!userDoc.exists) {
        // Crear documento de usuario
        await this.db
          .collection("usuarios")
          .doc(result.user.uid)
          .set({
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            configuracion: {
              moneda: "PEN",
              tema: "light",
              notificaciones: true,
            },
          });
      }

      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
    } catch (error) {
      console.error("❌ Error al iniciar sesión con Google:", error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<void>}
   */
  async cerrarSesion() {
    try {
      await this.auth.signOut();
      console.log("✅ Sesión cerrada correctamente");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      throw error;
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} Información del usuario o null si no hay usuario
   */
  obtenerUsuarioActual() {
    const user = this.auth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  // =================================================================
  // TRANSACCIONES
  // =================================================================

  /**
   * Agrega una nueva transacción
   * @param {Object} transaccion - Datos de la transacción
   * @param {string} transaccion.fecha - Fecha en formato YYYY-MM-DD
   * @param {string} transaccion.tipo - Tipo de transacción (ingreso, gasto, ahorro)
   * @param {string} transaccion.categoria - ID de la categoría
   * @param {number} transaccion.monto - Monto de la transacción
   * @param {string} transaccion.descripcion - Descripción de la transacción
   * @returns {Promise<string>} ID de la transacción creada
   */
  async agregarTransaccion(transaccion) {
    this._checkInitAndAuth();

    try {
      // Validar datos mínimos
      if (!transaccion.fecha || !transaccion.tipo || !transaccion.monto) {
        throw new Error("Faltan campos obligatorios en la transacción");
      }

      // Formatear datos
      const nuevaTransaccion = {
        fecha: transaccion.fecha,
        tipo: transaccion.tipo,
        categoria: transaccion.categoria || null,
        monto: parseFloat(transaccion.monto),
        descripcion: transaccion.descripcion || "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Agregar a Firestore
      const docRef = await this._getUserCollection("transacciones").add(
        nuevaTransaccion
      );
      console.log(`✅ Transacción agregada con ID: ${docRef.id}`);

      return docRef.id;
    } catch (error) {
      console.error("❌ Error al agregar transacción:", error);
      throw error;
    }
  }

  /**
   * Obtiene todas las transacciones del usuario
   * @param {Object} opciones - Opciones de filtrado
   * @param {string} [opciones.desde] - Fecha de inicio en formato YYYY-MM-DD
   * @param {string} [opciones.hasta] - Fecha de fin en formato YYYY-MM-DD
   * @param {string} [opciones.tipo] - Filtrar por tipo de transacción
   * @param {string} [opciones.categoria] - Filtrar por categoría
   * @param {number} [opciones.limite=100] - Límite de resultados a obtener
   * @returns {Promise<Array>} Lista de transacciones
   */
  async obtenerTransacciones(opciones = {}) {
    this._checkInitAndAuth();

    try {
      // Comenzar con la consulta base
      let query = this._getUserCollection("transacciones");

      // Aplicar filtros si existen
      if (opciones.desde) {
        query = query.where("fecha", ">=", opciones.desde);
      }

      if (opciones.hasta) {
        query = query.where("fecha", "<=", opciones.hasta);
      }

      if (opciones.tipo) {
        query = query.where("tipo", "==", opciones.tipo);
      }

      if (opciones.categoria) {
        query = query.where("categoria", "==", opciones.categoria);
      }

      // Ordenar por fecha descendente (más recientes primero)
      query = query.orderBy("fecha", "desc");

      // Aplicar límite
      const limite = opciones.limite || 100;
      query = query.limit(limite);

      // Ejecutar consulta
      const snapshot = await query.get();

      // Formatear resultados
      const transacciones = [];
      snapshot.forEach((doc) => {
        transacciones.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ Se obtuvieron ${transacciones.length} transacciones`);
      return transacciones;
    } catch (error) {
      console.error("❌ Error al obtener transacciones:", error);
      throw error;
    }
  }

  /**
   * Actualiza una transacción existente
   * @param {string} id - ID de la transacción
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<void>}
   */
  async actualizarTransaccion(id, datos) {
    this._checkInitAndAuth();

    try {
      // Verificar que la transacción existe
      const transaccionRef = this._getUserCollection("transacciones").doc(id);
      const doc = await transaccionRef.get();

      if (!doc.exists) {
        throw new Error(`No existe una transacción con el ID: ${id}`);
      }

      // Preparar datos de actualización
      const datosActualizados = {
        ...datos,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Si se proporciona el monto, asegurarse de que sea un número
      if (datos.monto !== undefined) {
        datosActualizados.monto = parseFloat(datos.monto);
      }

      // Actualizar en Firestore
      await transaccionRef.update(datosActualizados);
      console.log(`✅ Transacción ${id} actualizada correctamente`);
    } catch (error) {
      console.error(`❌ Error al actualizar transacción ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una transacción
   * @param {string} id - ID de la transacción a eliminar
   * @returns {Promise<void>}
   */
  async eliminarTransaccion(id) {
    this._checkInitAndAuth();

    try {
      await this._getUserCollection("transacciones").doc(id).delete();
      console.log(`✅ Transacción ${id} eliminada correctamente`);
    } catch (error) {
      console.error(`❌ Error al eliminar transacción ${id}:`, error);
      throw error;
    }
  }

  // =================================================================
  // CATEGORÍAS
  // =================================================================

  /**
   * Agrega una nueva categoría
   * @param {Object} categoria - Datos de la categoría
   * @param {string} categoria.nombre - Nombre de la categoría
   * @param {string} categoria.tipo - Tipo de categoría (ingreso, gasto, ahorro)
   * @param {string} categoria.color - Color en formato hexadecimal
   * @returns {Promise<string>} ID de la categoría creada
   */
  async agregarCategoria(categoria) {
    this._checkInitAndAuth();

    try {
      // Validar datos mínimos
      if (!categoria.nombre || !categoria.tipo) {
        throw new Error("Faltan campos obligatorios en la categoría");
      }

      // Formatear datos
      const nuevaCategoria = {
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        color: categoria.color || "#CCCCCC",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Agregar a Firestore
      const docRef = await this._getUserCollection("categorias").add(
        nuevaCategoria
      );
      console.log(`✅ Categoría agregada con ID: ${docRef.id}`);

      return docRef.id;
    } catch (error) {
      console.error("❌ Error al agregar categoría:", error);
      throw error;
    }
  }

  /**
   * Obtiene todas las categorías del usuario
   * @param {string} [tipo] - Filtrar por tipo de categoría
   * @returns {Promise<Array>} Lista de categorías
   */
  async obtenerCategorias(tipo = null) {
    this._checkInitAndAuth();

    try {
      // Comenzar con la consulta base
      let query = this._getUserCollection("categorias");

      // Aplicar filtro por tipo si existe
      if (tipo) {
        query = query.where("tipo", "==", tipo);
      }

      // Ordenar por nombre
      query = query.orderBy("nombre");

      // Ejecutar consulta
      const snapshot = await query.get();

      // Formatear resultados
      const categorias = [];
      snapshot.forEach((doc) => {
        categorias.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ Se obtuvieron ${categorias.length} categorías`);
      return categorias;
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
      throw error;
    }
  }

  /**
   * Actualiza una categoría existente
   * @param {string} id - ID de la categoría
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<void>}
   */
  async actualizarCategoria(id, datos) {
    this._checkInitAndAuth();

    try {
      // Preparar datos de actualización
      const datosActualizados = {
        ...datos,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Actualizar en Firestore
      await this._getUserCollection("categorias")
        .doc(id)
        .update(datosActualizados);
      console.log(`✅ Categoría ${id} actualizada correctamente`);
    } catch (error) {
      console.error(`❌ Error al actualizar categoría ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una categoría
   * @param {string} id - ID de la categoría a eliminar
   * @returns {Promise<void>}
   */
  async eliminarCategoria(id) {
    this._checkInitAndAuth();

    try {
      await this._getUserCollection("categorias").doc(id).delete();
      console.log(`✅ Categoría ${id} eliminada correctamente`);
    } catch (error) {
      console.error(`❌ Error al eliminar categoría ${id}:`, error);
      throw error;
    }
  }

  // =================================================================
  // METAS DE AHORRO
  // =================================================================

  /**
   * Agrega una nueva meta de ahorro
   * @param {Object} meta - Datos de la meta
   * @param {string} meta.nombre - Nombre de la meta
   * @param {number} meta.montoObjetivo - Monto objetivo
   * @param {number} meta.montoActual - Monto actual (opcional, por defecto 0)
   * @param {string} meta.fechaObjetivo - Fecha objetivo en formato YYYY-MM-DD
   * @param {string} meta.color - Color en formato hexadecimal
   * @returns {Promise<string>} ID de la meta creada
   */
  async agregarMeta(meta) {
    this._checkInitAndAuth();

    try {
      // Validar datos mínimos
      if (!meta.nombre || !meta.montoObjetivo) {
        throw new Error("Faltan campos obligatorios en la meta");
      }

      // Formatear datos
      const nuevaMeta = {
        nombre: meta.nombre,
        montoObjetivo: parseFloat(meta.montoObjetivo),
        montoActual: parseFloat(meta.montoActual || 0),
        fechaObjetivo: meta.fechaObjetivo || null,
        color: meta.color || "#4CAF50",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Agregar a Firestore
      const docRef = await this._getUserCollection("metas").add(nuevaMeta);
      console.log(`✅ Meta de ahorro agregada con ID: ${docRef.id}`);

      return docRef.id;
    } catch (error) {
      console.error("❌ Error al agregar meta de ahorro:", error);
      throw error;
    }
  }

  /**
   * Obtiene todas las metas de ahorro del usuario
   * @returns {Promise<Array>} Lista de metas de ahorro
   */
  async obtenerMetas() {
    this._checkInitAndAuth();

    try {
      // Ejecutar consulta ordenada por fecha objetivo
      const snapshot = await this._getUserCollection("metas")
        .orderBy("fechaObjetivo")
        .get();

      // Formatear resultados
      const metas = [];
      snapshot.forEach((doc) => {
        metas.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ Se obtuvieron ${metas.length} metas de ahorro`);
      return metas;
    } catch (error) {
      console.error("❌ Error al obtener metas de ahorro:", error);
      throw error;
    }
  }

  /**
   * Actualiza una meta de ahorro existente
   * @param {string} id - ID de la meta
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<void>}
   */
  async actualizarMeta(id, datos) {
    this._checkInitAndAuth();

    try {
      // Preparar datos de actualización
      const datosActualizados = {
        ...datos,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Si se proporcionan montos, asegurarse de que sean números
      if (datos.montoObjetivo !== undefined) {
        datosActualizados.montoObjetivo = parseFloat(datos.montoObjetivo);
      }

      if (datos.montoActual !== undefined) {
        datosActualizados.montoActual = parseFloat(datos.montoActual);
      }

      // Actualizar en Firestore
      await this._getUserCollection("metas").doc(id).update(datosActualizados);
      console.log(`✅ Meta de ahorro ${id} actualizada correctamente`);
    } catch (error) {
      console.error(`❌ Error al actualizar meta de ahorro ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una meta de ahorro
   * @param {string} id - ID de la meta a eliminar
   * @returns {Promise<void>}
   */
  async eliminarMeta(id) {
    this._checkInitAndAuth();

    try {
      await this._getUserCollection("metas").doc(id).delete();
      console.log(`✅ Meta de ahorro ${id} eliminada correctamente`);
    } catch (error) {
      console.error(`❌ Error al eliminar meta de ahorro ${id}:`, error);
      throw error;
    }
  }

  // =================================================================
  // ESTADÍSTICAS Y REPORTES
  // =================================================================

  /**
   * Obtiene estadísticas de transacciones para un período
   * @param {string} desde - Fecha inicio en formato YYYY-MM-DD
   * @param {string} hasta - Fecha fin en formato YYYY-MM-DD
   * @returns {Promise<Object>} Estadísticas de transacciones
   */
  async obtenerEstadisticas(desde, hasta) {
    this._checkInitAndAuth();

    try {
      // Obtener todas las transacciones del período
      const transacciones = await this.obtenerTransacciones({
        desde,
        hasta,
        limite: 1000, // Obtener un número alto para el análisis
      });

      // Inicializar estadísticas
      const estadisticas = {
        totalIngresos: 0,
        totalGastos: 0,
        totalAhorros: 0,
        balance: 0,
        porCategoria: {},
        porMes: {},
        porDiaSemana: {},
      };

      // Procesar transacciones
      transacciones.forEach((tx) => {
        // Sumar por tipo
        if (tx.tipo === "ingreso") {
          estadisticas.totalIngresos += tx.monto;
        } else if (tx.tipo === "gasto") {
          estadisticas.totalGastos += tx.monto;
        } else if (tx.tipo === "ahorro") {
          estadisticas.totalAhorros += tx.monto;
        }

        // Procesar por categoría
        const catKey = `${tx.tipo}-${tx.categoria || "sin_categoria"}`;
        if (!estadisticas.porCategoria[catKey]) {
          estadisticas.porCategoria[catKey] = {
            tipo: tx.tipo,
            categoria: tx.categoria,
            total: 0,
            cantidad: 0,
          };
        }
        estadisticas.porCategoria[catKey].total += tx.monto;
        estadisticas.porCategoria[catKey].cantidad += 1;

        // Procesar por mes
        const fecha = new Date(tx.fecha);
        const mesKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
        if (!estadisticas.porMes[mesKey]) {
          estadisticas.porMes[mesKey] = {
            ingresos: 0,
            gastos: 0,
            ahorros: 0,
          };
        }

        if (tx.tipo === "ingreso") {
          estadisticas.porMes[mesKey].ingresos += tx.monto;
        } else if (tx.tipo === "gasto") {
          estadisticas.porMes[mesKey].gastos += tx.monto;
        } else if (tx.tipo === "ahorro") {
          estadisticas.porMes[mesKey].ahorros += tx.monto;
        }

        // Procesar por día de la semana
        const diaSemana = fecha.getDay(); // 0=domingo, 1=lunes, ...
        if (!estadisticas.porDiaSemana[diaSemana]) {
          estadisticas.porDiaSemana[diaSemana] = {
            ingresos: 0,
            gastos: 0,
            ahorros: 0,
            cantidad: 0,
          };
        }

        if (tx.tipo === "ingreso") {
          estadisticas.porDiaSemana[diaSemana].ingresos += tx.monto;
        } else if (tx.tipo === "gasto") {
          estadisticas.porDiaSemana[diaSemana].gastos += tx.monto;
        } else if (tx.tipo === "ahorro") {
          estadisticas.porDiaSemana[diaSemana].ahorros += tx.monto;
        }

        estadisticas.porDiaSemana[diaSemana].cantidad += 1;
      });

      // Calcular balance
      estadisticas.balance =
        estadisticas.totalIngresos - estadisticas.totalGastos;

      console.log("✅ Estadísticas generadas correctamente");
      return estadisticas;
    } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error);
      throw error;
    }
  }

  /**
   * Migra datos de Google Sheets a Firebase
   * @param {Array} transacciones - Lista de transacciones de Google Sheets
   * @returns {Promise<Object>} Resultado de la migración
   */
  async migrarDesdeGoogleSheets(transacciones) {
    this._checkInitAndAuth();

    try {
      console.log(
        `🔄 Iniciando migración de ${transacciones.length} transacciones desde Google Sheets`
      );

      // Preparar categorías únicas
      const categoriasUnicas = new Map();

      // Crear lote para operaciones en batch
      const batch = this.db.batch();

      // Colecciones de referencia
      const txCollection = this._getUserCollection("transacciones");
      const catCollection = this._getUserCollection("categorias");

      // Mapear colores por tipo
      const coloresPorTipo = {
        ingreso: ["#4CAF50", "#8BC34A", "#CDDC39", "#009688"],
        gasto: ["#F44336", "#FF5722", "#FF9800", "#E91E63"],
        ahorro: ["#2196F3", "#03A9F4", "#00BCD4", "#607D8B"],
      };

      // Mapear categorías y asignar colores
      transacciones.forEach((tx) => {
        if (tx.categoria && !categoriasUnicas.has(tx.categoria)) {
          const tipo = tx.tipo.toLowerCase();
          const colores = coloresPorTipo[tipo] || ["#9E9E9E"];
          const colorIndex = categoriasUnicas.size % colores.length;

          categoriasUnicas.set(tx.categoria, {
            nombre: tx.categoria,
            tipo: tipo,
            color: colores[colorIndex],
          });
        }
      });

      // Crear categorías primero
      const categoriaPromesas = [];
      const categoriasMapeadas = new Map();

      for (const [nombre, datos] of categoriasUnicas.entries()) {
        const nuevaCategoriaRef = catCollection.doc();
        batch.set(nuevaCategoriaRef, {
          ...datos,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        categoriasMapeadas.set(nombre, nuevaCategoriaRef.id);
        categoriaPromesas.push(nuevaCategoriaRef.id);
      }

      // Crear transacciones
      transacciones.forEach((tx) => {
        const nuevaTransaccionRef = txCollection.doc();

        // Obtener ID de categoría si existe
        const categoriaId = tx.categoria
          ? categoriasMapeadas.get(tx.categoria)
          : null;

        batch.set(nuevaTransaccionRef, {
          fecha: tx.fecha,
          tipo: tx.tipo.toLowerCase(),
          categoria: categoriaId,
          monto: parseFloat(tx.monto),
          descripcion: tx.descripcion || "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });

      // Ejecutar batch
      await batch.commit();

      const resultado = {
        transaccionesMigradas: transacciones.length,
        categoriasMigradas: categoriasUnicas.size,
        exitoso: true,
      };

      console.log("✅ Migración completada correctamente:", resultado);
      return resultado;
    } catch (error) {
      console.error("❌ Error durante la migración:", error);
      throw error;
    }
  }
}

// Exportar API como global
window.API = new FirebaseAPI();
