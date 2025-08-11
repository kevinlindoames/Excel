# Guía Rápida: Firebase para Control Financiero

Esta guía detallada te ayudará a entender cómo funciona Firebase en tu aplicación de Control Financiero y cómo utilizarla paso a paso.

## ¿Qué es Firebase?

Firebase es una plataforma de desarrollo de aplicaciones móviles y web desarrollada por Google. Proporciona herramientas que te permiten:

- Autenticar usuarios de manera segura
- Almacenar datos en la nube (Firestore)
- Alojar tu aplicación web
- Enviar notificaciones
- Analizar el uso de tu aplicación

En nuestro Control Financiero, utilizamos principalmente:

- **Firebase Authentication**: Para la gestión de usuarios
- **Firestore Database**: Para almacenar transacciones, categorías y metas

## Paso 1: Configuración Inicial

Antes de comenzar a usar la aplicación, necesitas seguir los pasos detallados en el documento `CONFIGURACION_FIREBASE.md`. A continuación, un resumen:

1. Crear un proyecto en la [Consola de Firebase](https://console.firebase.google.com/)
2. Habilitar la autenticación (Email/Password y Google)
3. Configurar Firestore Database
4. Obtener las credenciales de la aplicación web
5. Actualizar el archivo `js/firebase-config.js` con tus credenciales

## Paso 2: Entender la Estructura de la Aplicación

Nuestra aplicación tiene los siguientes archivos relacionados con Firebase:

1. **firebase-config.js**: Contiene la configuración y credenciales
2. **firebase-api.js**: Implementa todas las operaciones con Firebase
3. **firebase-utils.js**: Funciones auxiliares para manipular datos
4. **firebase-app.js**: Lógica de la aplicación e inicialización

## Paso 3: Inicialización de Firebase

Cuando abres `index-firebase.html`, la aplicación:

1. Carga las bibliotecas necesarias de Firebase
2. Ejecuta la inicialización mediante `window.FIREBASE.init()`
3. Verifica si hay un usuario autenticado
4. Muestra la pantalla de login o el dashboard según corresponda

## Paso 4: Autenticación de Usuarios

### Registrar un Nuevo Usuario

```javascript
// Ejemplo de registro
async function registrarUsuario() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const nombre = document.getElementById("register-name").value;

  try {
    // Llamar a la API
    await window.API.registrarUsuario(email, password, nombre);
    console.log("¡Usuario registrado correctamente!");
  } catch (error) {
    console.error("Error al registrar:", error);
    mostrarError(error.message);
  }
}
```

### Iniciar Sesión

```javascript
// Ejemplo de inicio de sesión
async function iniciarSesion() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    // Llamar a la API
    await window.API.iniciarSesion(email, password);
    console.log("¡Sesión iniciada correctamente!");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    mostrarError(error.message);
  }
}
```

### Iniciar Sesión con Google

```javascript
// Ejemplo de inicio de sesión con Google
async function iniciarSesionConGoogle() {
  try {
    // Llamar a la API
    await window.API.iniciarSesionConGoogle();
    console.log("¡Sesión iniciada con Google correctamente!");
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    mostrarError(error.message);
  }
}
```

### Cerrar Sesión

```javascript
// Ejemplo de cierre de sesión
async function cerrarSesion() {
  try {
    // Llamar a la API
    await window.API.cerrarSesion();
    console.log("Sesión cerrada correctamente");
    // Redirigir a la pantalla de login
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}
```

## Paso 5: Trabajar con Transacciones

### Agregar una Nueva Transacción

```javascript
// Ejemplo para agregar una transacción
async function agregarTransaccion() {
  // Obtener datos del formulario
  const transaccion = {
    fecha: document.getElementById("transaction-date").value,
    tipo: document.getElementById("transaction-type").value,
    categoria: document.getElementById("transaction-category").value,
    monto: parseFloat(document.getElementById("transaction-amount").value),
    descripcion: document.getElementById("transaction-description").value,
  };

  try {
    // Llamar a la API
    const id = await window.API.agregarTransaccion(transaccion);
    console.log(`Transacción agregada con ID: ${id}`);
    // Actualizar UI, cerrar modal, etc.
  } catch (error) {
    console.error("Error al agregar transacción:", error);
    mostrarError(error.message);
  }
}
```

### Obtener Transacciones

```javascript
// Ejemplo para obtener transacciones
async function cargarTransacciones() {
  try {
    // Definir opciones de filtrado (opcional)
    const opciones = {
      desde: "2025-01-01",
      hasta: "2025-12-31",
      tipo: "gasto", // opcional
      categoria: "cat001", // opcional
    };

    // Llamar a la API
    const transacciones = await window.API.obtenerTransacciones(opciones);
    console.log(`Se obtuvieron ${transacciones.length} transacciones`);

    // Actualizar UI con los datos
    mostrarTransaccionesEnTabla(transacciones);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    mostrarError(error.message);
  }
}
```

### Actualizar una Transacción

```javascript
// Ejemplo para actualizar una transacción
async function actualizarTransaccion(id) {
  // Obtener datos actualizados
  const datosActualizados = {
    monto: 150.75,
    descripcion: "Descripción actualizada",
  };

  try {
    // Llamar a la API
    await window.API.actualizarTransaccion(id, datosActualizados);
    console.log(`Transacción ${id} actualizada correctamente`);
    // Actualizar UI
  } catch (error) {
    console.error("Error al actualizar transacción:", error);
    mostrarError(error.message);
  }
}
```

### Eliminar una Transacción

```javascript
// Ejemplo para eliminar una transacción
async function eliminarTransaccion(id) {
  // Confirmar con el usuario
  if (!confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
    return;
  }

  try {
    // Llamar a la API
    await window.API.eliminarTransaccion(id);
    console.log(`Transacción ${id} eliminada correctamente`);
    // Actualizar UI
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    mostrarError(error.message);
  }
}
```

## Paso 6: Trabajar con Categorías

### Agregar una Nueva Categoría

```javascript
// Ejemplo para agregar una categoría
async function agregarCategoria() {
  // Obtener datos del formulario
  const categoria = {
    nombre: document.getElementById("category-name").value,
    tipo: document.getElementById("category-type").value,
    color: document.getElementById("category-color").value,
  };

  try {
    // Llamar a la API
    const id = await window.API.agregarCategoria(categoria);
    console.log(`Categoría agregada con ID: ${id}`);
    // Actualizar UI, cerrar modal, etc.
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    mostrarError(error.message);
  }
}
```

### Obtener Categorías

```javascript
// Ejemplo para obtener categorías
async function cargarCategorias() {
  try {
    // Obtener todas las categorías
    const categorias = await window.API.obtenerCategorias();
    console.log(`Se obtuvieron ${categorias.length} categorías`);

    // O filtrar por tipo
    const categoriasGasto = await window.API.obtenerCategorias("gasto");
    console.log(`Se obtuvieron ${categoriasGasto.length} categorías de gasto`);

    // Actualizar UI con los datos
    mostrarCategoriasEnUI(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    mostrarError(error.message);
  }
}
```

## Paso 7: Trabajar con Metas de Ahorro

### Agregar una Nueva Meta

```javascript
// Ejemplo para agregar una meta de ahorro
async function agregarMeta() {
  // Obtener datos del formulario
  const meta = {
    nombre: document.getElementById("goal-name").value,
    montoObjetivo: parseFloat(document.getElementById("goal-target").value),
    montoActual: parseFloat(document.getElementById("goal-current").value || 0),
    fechaObjetivo: document.getElementById("goal-date").value,
    color: document.getElementById("goal-color").value,
  };

  try {
    // Llamar a la API
    const id = await window.API.agregarMeta(meta);
    console.log(`Meta agregada con ID: ${id}`);
    // Actualizar UI, cerrar modal, etc.
  } catch (error) {
    console.error("Error al agregar meta:", error);
    mostrarError(error.message);
  }
}
```

## Paso 8: Manejo de Errores

Firebase puede devolver varios tipos de errores. Para manejarlos correctamente:

1. **Usa bloques try-catch** en todas las operaciones asíncronas
2. **Muestra mensajes de error amigables** al usuario
3. **Registra los errores en la consola** para depuración
4. **Consulta el documento `SOLUCION_ERRORES_FIREBASE.md`** para soluciones a problemas comunes

```javascript
// Ejemplo de función para mostrar errores
function mostrarError(mensaje) {
  // Crear elemento de alerta
  const alertElement = document.createElement("div");
  alertElement.className = "alert alert-danger alert-dismissible fade show";
  alertElement.role = "alert";

  // Añadir mensaje
  alertElement.innerHTML = `
    <strong>Error:</strong> ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Añadir al DOM
  document.getElementById("alerts-container").appendChild(alertElement);

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alertElement);
    bsAlert.close();
  }, 5000);
}
```

## Paso 9: Funcionalidades Avanzadas

### Trabajar Offline

Firebase Firestore permite trabajar offline. Los datos se sincronizan automáticamente cuando se restablece la conexión:

```javascript
// En firebase-config.js ya se activa la persistencia offline
firestoreDB
  .enablePersistence({ synchronizeTabs: true })
  .then(() => {
    console.log("✅ Persistencia de Firestore habilitada");
  })
  .catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn(
        "⚠️ La persistencia no pudo habilitarse porque hay múltiples pestañas abiertas"
      );
    } else if (err.code === "unimplemented") {
      console.warn(
        "⚠️ El navegador actual no soporta las características de persistencia"
      );
    }
  });
```

### Escucha de Cambios en Tiempo Real

Puedes escuchar cambios en tiempo real en tus datos:

```javascript
// Ejemplo de escucha en tiempo real
function escucharTransaccionesEnTiempoReal() {
  // Obtener referencia a la colección de transacciones del usuario
  const transaccionesRef = window.API._getUserCollection("transacciones");

  // Configurar escucha
  const unsubscribe = transaccionesRef
    .orderBy("fecha", "desc")
    .limit(20)
    .onSnapshot(
      (snapshot) => {
        const transacciones = [];

        snapshot.forEach((doc) => {
          transacciones.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        console.log("Datos actualizados en tiempo real:", transacciones);
        actualizarUIConNuevosDatos(transacciones);
      },
      (error) => {
        console.error("Error en la escucha en tiempo real:", error);
      }
    );

  // Guardar la función para cancelar la escucha
  // Importante: llamar a unsubscribe() cuando ya no se necesite la escucha
  // por ejemplo, al cambiar de página o cerrar sesión
  return unsubscribe;
}
```

## Paso 10: Buenas Prácticas

1. **Seguridad**:

   - No almacenes datos sensibles sin encriptar
   - Usa reglas de seguridad apropiadas en Firestore
   - Valida los datos antes de enviarlos a Firebase

2. **Rendimiento**:

   - Limita el número de documentos que obtienes
   - Usa consultas eficientes con índices
   - Implementa paginación para grandes conjuntos de datos

3. **Organización**:

   - Mantén una estructura de datos consistente
   - Documenta tus modelos de datos
   - Separa la lógica de UI de las operaciones con Firebase

4. **Actualización de UI**:
   - Actualiza la UI solo después de confirmar que los datos se guardaron correctamente
   - Implementa indicadores de carga para operaciones asíncronas
   - Maneja los errores de forma amigable para el usuario

## Recursos Adicionales

- **Documentación completa**: [Firebase Docs](https://firebase.google.com/docs)
- **Solución de problemas**: Ver `SOLUCION_ERRORES_FIREBASE.md` para soluciones específicas
- **Ejemplos de código**: Estudia los archivos `firebase-*.js` para ver la implementación completa
- **Configuración detallada**: Revisa `CONFIGURACION_FIREBASE.md` para pasos detallados de configuración

---

¡Ahora estás listo para usar Firebase en tu aplicación de Control Financiero! Recuerda que esta guía es un complemento a la configuración inicial. Asegúrate de completar primero los pasos en `CONFIGURACION_FIREBASE.md` antes de comenzar a utilizar la aplicación.
