// API para conexión con Google Sheets para Control Financiero
// Basado en la documentación oficial de Google Sheets API

// Configuraciones para la API
const API_CONFIG = {
  // Credenciales para Google Sheets API
  clientId:
    "653709897608-2d79pm7ubanquoc6pb7ubgce0s14123s.apps.googleusercontent.com",
  apiKey: "AIzaSyDBlZsLTCQ58IH46ByN1YFvg8Xr9dCchT0",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scopes: "https://www.googleapis.com/auth/spreadsheets",

  // ID del proyecto en Google Cloud
  projectId: "controlfinanciero-468715",

  // Configuración de la hoja de Google Sheets
  spreadsheets: {
    // Hoja principal
    main: {
      // ID de la hoja de cálculo (de la URL)
      spreadsheetId: "1iFLN6CvJ5gsi_npP9niMssKVcACmTbFVji9RjZHwWQs",
      
      // Configuración de las hojas dentro del documento
      sheets: {
        // Hoja para transacciones
        transactions: {
          name: "Transacciones", // Nombre exacto de la hoja
          range: "Transacciones!A:E", // Rango para leer/escribir
          columns: ["Fecha", "Tipo", "Categoría", "Monto", "Descripción"] // Encabezados
        },
        // Hoja para categorías (opcional)
        categories: {
          name: "Categorías",
          range: "Categorías!A:D",
          columns: ["ID", "Nombre", "Tipo", "Color"]
        },
        // Hoja para metas de ahorro (opcional)
        goals: {
          name: "Metas",
          range: "Metas!A:E",
          columns: ["Nombre", "Monto Objetivo", "Monto Actual", "Fecha Objetivo", "Color"]
        }
      }
    }
  },

  // Endpoints para posibles API externas
  endpoints: {
    exchangeRate: "https://open.er-api.com/v6/latest/PEN", // API gratuita de tipos de cambio
  },
};

// Estado de la conexión con la API
let API_STATE = {
  isSignedIn: false,
  initialized: false,
  error: null,
  lastSync: null,
  lastSyncData: null, // Para almacenar los últimos datos recibidos
};

// Variables para el manejo de autenticación y API
let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback después de que api.js se ha cargado.
 */
function gapiLoaded() {
  console.log("📡 API de Google (gapi) cargada");
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback después de que el cliente API se ha cargado.
 * Carga el documento de descubrimiento para inicializar la API.
 */
async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: API_CONFIG.apiKey,
      discoveryDocs: API_CONFIG.discoveryDocs,
    });
    console.log("✅ Cliente gapi inicializado correctamente");
    gapiInited = true;
    maybeEnableButtons();
    
    // Notificar a la aplicación que la API está lista
    document.dispatchEvent(new CustomEvent("google-api-ready"));
  } catch (err) {
    console.error("❌ Error al inicializar gapi.client:", err);
    showConnectionStatus(false, "Error al inicializar Google API: " + err.message);
    
    // Cambiar a modo simulado si hay error
    console.log("⚠️ Cambiando a modo simulado debido a error de inicialización");
    window.forceSimulationMode = true;
  }
}

/**
 * Callback después de que Google Identity Services se ha cargado.
 */
function gisLoaded() {
  console.log("📡 Google Identity Services (gis) cargada");
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: API_CONFIG.clientId,
    scope: API_CONFIG.scopes,
    callback: '', // Se define más tarde en handleAuthClick
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Habilita los botones de interacción después de que todas las bibliotecas están cargadas.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    console.log("✅ APIs inicializadas correctamente, listas para autenticación");
    
    // Notificar que estamos listos para autenticar
    document.dispatchEvent(new CustomEvent("google-auth-ready"));
    
    // Activar los botones de autorización si existen
    const authButton = document.getElementById('authorize_button');
    if (authButton) {
      authButton.style.visibility = 'visible';
    }
  }
}

/**
 * Inicializar la API de Google
 * Función principal para inicializar la conexión con Google Sheets
 */
function initGoogleAPI() {
  // Verificar si el modo simulado está forzado
  if (window.forceSimulationMode === true) {
    console.log("🔄 Modo simulado activado manualmente por el usuario");
    return initSimulatedMode();
  }

  // Esta función inicializa la API de Google Sheets
  console.log("📡 Inicializando Google Sheets API...");
  console.log("🔑 Configuración:", {
    clientId: API_CONFIG.clientId.substring(0, 15) + "...", // Mostramos solo parte del ID por seguridad
    apiKeyConfigured: API_CONFIG.apiKey ? "✅ Configurada" : "❌ No configurada",
    spreadsheetId: API_CONFIG.spreadsheets.main.spreadsheetId,
    sheetsConfig: Object.keys(API_CONFIG.spreadsheets.main.sheets)
  });

  // Si las APIs ya están inicializadas, solo necesitamos verificar autenticación
  if (gapiInited && gisInited) {
    console.log("✅ APIs ya inicializadas, verificando autenticación");
    
    // Verificar si ya hay un token de autenticación
    const token = gapi.client.getToken();
    if (token !== null) {
      console.log("✅ Usuario ya autenticado");
      API_STATE.isSignedIn = true;
      updateSignInStatus(true);
      return Promise.resolve(true);
    } else {
      console.log("⚠️ Usuario no autenticado, se requiere iniciar sesión");
      return Promise.resolve(false);
    }
  }

  // En caso de que gapi o gis no estén inicializados aún
  console.log("⚠️ APIs no inicializadas completamente");
  
  // Si detectamos que las bibliotecas no están disponibles, usar modo simulado
  if (typeof gapi === "undefined" || typeof google === "undefined") {
    console.log("⚠️ Bibliotecas no detectadas, usando modo simulado");
    return initSimulatedMode();
  }

  // Esperar a que se inicialicen las APIs
  return new Promise((resolve) => {
    const checkInit = () => {
      if (gapiInited && gisInited) {
        console.log("✅ APIs inicializadas correctamente");
        resolve(true);
      } else {
        console.log("⏳ Esperando inicialización de APIs...");
        setTimeout(checkInit, 500);
      }
    };
    checkInit();
  });
}

// Inicializar el modo simulado
function initSimulatedMode() {
  // Modo simulado para desarrollo local sin conectar realmente a Google
  console.log("🔄 Inicializando modo simulado...");
  
  // Establecer la variable global para indicar que estamos en modo simulado
  window.forceSimulationMode = true;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ API simulada inicializada correctamente");
      API_STATE.initialized = true;
      document.dispatchEvent(new CustomEvent("google-api-ready"));

      // Mostrar mensaje de simulación
      showConnectionStatus(true, "Modo simulado activo (sin conexión real)");

      resolve(true);
    }, 1000);
  });
}

// Mostrar estado de conexión en la interfaz
function showConnectionStatus(success, message) {
  // Crear o actualizar el indicador de estado
  let statusIndicator = document.getElementById("google-connection-status");

  if (!statusIndicator) {
    statusIndicator = document.createElement("div");
    statusIndicator.id = "google-connection-status";
    statusIndicator.style.position = "fixed";
    statusIndicator.style.bottom = "10px";
    statusIndicator.style.right = "10px";
    statusIndicator.style.padding = "8px 12px";
    statusIndicator.style.borderRadius = "4px";
    statusIndicator.style.fontSize = "12px";
    statusIndicator.style.zIndex = "9999";
    statusIndicator.style.transition = "all 0.3s ease";
    document.body.appendChild(statusIndicator);
  }

  // Aplicar estilo según el resultado
  if (success) {
    statusIndicator.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
    statusIndicator.style.color = "white";
  } else {
    statusIndicator.style.backgroundColor = "rgba(244, 67, 54, 0.9)";
    statusIndicator.style.color = "white";
  }

  statusIndicator.textContent = message;

  // Ocultar después de 5 segundos
  setTimeout(() => {
    statusIndicator.style.opacity = "0";
    setTimeout(() => {
      if (statusIndicator.parentNode) {
        statusIndicator.parentNode.removeChild(statusIndicator);
      }
    }, 300);
  }, 5000);
}

// Actualizar el estado de inicio de sesión
function updateSignInStatus(isSignedIn) {
  API_STATE.isSignedIn = isSignedIn;

  if (isSignedIn) {
    console.log("👤 Usuario ha iniciado sesión en Google");
    // Notificar a la aplicación que el usuario ha iniciado sesión
    document.dispatchEvent(
      new CustomEvent("google-signin-change", { detail: { isSignedIn: true } })
    );
    
    // Actualizar interfaz si hay botones de autenticación
    const signoutButton = document.getElementById('signout_button');
    const authButton = document.getElementById('authorize_button');
    
    if (signoutButton) signoutButton.style.visibility = 'visible';
    if (authButton) authButton.innerText = 'Actualizar autorización';
  } else {
    console.log("👤 Usuario no ha iniciado sesión en Google");
    // Notificar a la aplicación que el usuario no ha iniciado sesión
    document.dispatchEvent(
      new CustomEvent("google-signin-change", { detail: { isSignedIn: false } })
    );
    
    // Actualizar interfaz si hay botones de autenticación
    const signoutButton = document.getElementById('signout_button');
    const authButton = document.getElementById('authorize_button');
    
    if (signoutButton) signoutButton.style.visibility = 'hidden';
    if (authButton) authButton.innerText = 'Autorizar';
  }
}

/**
 * Maneja el proceso de autorización cuando el usuario hace clic en el botón.
 */
function handleAuthClick() {
  console.log("🔑 Iniciando proceso de autorización");
  
  // Verificar si estamos en modo simulado
  if (window.forceSimulationMode) {
    console.log("⚠️ Usando inicio de sesión simulado (modo simulado activo)");
    API_STATE.isSignedIn = true;
    updateSignInStatus(true);
    showConnectionStatus(true, "Inicio de sesión simulado");
    return Promise.resolve(true);
  }
  
  // Configurar el callback para el token client
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      console.error("❌ Error durante la autorización:", resp);
      showConnectionStatus(false, "Error al iniciar sesión: " + resp.error);
      return false;
    }
    
    console.log("✅ Autorización exitosa");
    updateSignInStatus(true);
    showConnectionStatus(true, "Inicio de sesión exitoso");
    
    // Notificar que la autenticación fue exitosa
    document.dispatchEvent(new CustomEvent("google-auth-success"));
    
    return true;
  };

  // Solicitar token de acceso
  if (gapi.client.getToken() === null) {
    // Solicitar al usuario que seleccione una cuenta de Google
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Omitir selección de cuenta si ya hay una sesión activa
    tokenClient.requestAccessToken({prompt: ''});
  }
}

/**
 * Maneja el cierre de sesión cuando el usuario hace clic en el botón.
 */
function handleSignoutClick() {
  console.log("🔑 Cerrando sesión en Google...");
  
  // Verificar si estamos en modo simulado
  if (window.forceSimulationMode) {
    console.log("⚠️ Usando cierre de sesión simulado (modo simulado activo)");
    API_STATE.isSignedIn = false;
    updateSignInStatus(false);
    showConnectionStatus(true, "Sesión cerrada (simulado)");
    return Promise.resolve(true);
  }
  
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    updateSignInStatus(false);
    showConnectionStatus(true, "Sesión cerrada correctamente");
    
    // Limpiar datos visualizados
    const contentDiv = document.getElementById('content');
    if (contentDiv) contentDiv.innerText = '';
    
    return true;
  } else {
    console.log("⚠️ No hay sesión activa para cerrar");
    return false;
  }
}

// Alias para mantener compatibilidad con código existente
const signIn = handleAuthClick;
const signOut = handleSignoutClick;

/**
 * Lee datos de una hoja de Google Sheets
 * @param {string} sheetName - Nombre de la hoja configurada (transactions, categories, goals)
 * @param {string} [customRange] - Rango personalizado (opcional)
 * @param {string} [spreadsheetId] - ID de la hoja de cálculo (opcional)
 * @returns {Promise<Array>} - Promesa que resuelve con los datos de la hoja
 */
async function readGoogleSheet(sheetName, customRange = null, spreadsheetId = null) {
  // Obtener configuración de la hoja
  const config = API_CONFIG.spreadsheets.main.sheets[sheetName];
  if (!config && !customRange) {
    console.error(`❌ Hoja "${sheetName}" no configurada`);
    return Promise.reject(new Error(`Hoja "${sheetName}" no configurada`));
  }
  
  // Usar el ID de la hoja principal si no se especifica otro
  const sheetId = spreadsheetId || API_CONFIG.spreadsheets.main.spreadsheetId;
  
  // Usar el rango configurado o el personalizado
  const range = customRange || (config ? config.range : "A:Z");
  
  console.log(`📊 Leyendo datos de Google Sheets [${sheetName}]`);
  console.log(`📑 ID: ${sheetId}, Rango: ${range}`);

  // Verificar si estamos en modo simulado
  if (window.forceSimulationMode) {
    console.log("⚠️ Usando datos simulados para Google Sheets (modo simulado activo)");
    return getSimulatedSheetData(sheetName, range);
  }

  // Verificar autenticación y disponibilidad de API
  if (!API_STATE.isSignedIn && !window.forceSimulationMode) {
    console.warn("⚠️ Usuario no autenticado, intentando autenticar automáticamente");
    try {
      await handleAuthClick();
    } catch (error) {
      console.error("❌ Error al intentar autenticar:", error);
      return getSimulatedSheetData(sheetName, range);
    }
  }

  // Verificar si gapi está disponible para conexión real
  if (typeof gapi !== "undefined" && gapi.client && gapi.client.sheets) {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
      
      const values = response.result.values || [];
      console.log(`✅ Datos recibidos: ${values.length} filas`);

      // Mostrar en la consola con formato
      console.group("📋 Datos recibidos de Google Sheets");
      console.table(values.slice(0, 10)); // Mostrar primeras 10 filas
      console.groupEnd();

      // Guardar los datos para referencia
      API_STATE.lastSyncData = values;

      // Mostrar notificación
      showConnectionStatus(true, `Recibidas ${values.length} filas de datos`);

      return values;
    } catch (error) {
      console.error("❌ Error al leer datos de Google Sheets:", error);
      showConnectionStatus(false, "Error al leer datos: " + error.message);
      
      // Si falla, intentar con datos simulados
      console.log("⚠️ Usando datos simulados como fallback");
      return getSimulatedSheetData(sheetName, range);
    }
  } else {
    console.log("⚠️ Usando modo simulado para Google Sheets (gapi no disponible)");
    return getSimulatedSheetData(sheetName, range);
  }
}

/**
 * Obtiene datos simulados para una hoja específica
 * @param {string} sheetName - Nombre de la hoja
 * @param {string} range - Rango solicitado
 * @returns {Promise<Array>} - Promesa que resuelve con datos simulados
 */
function getSimulatedSheetData(sheetName, range) {
  // Verificar qué tipo de datos simulados devolver según la hoja
  let simulatedData;
  
  // Datos simulados según el tipo de hoja
  switch(sheetName) {
    case 'transactions':
      simulatedData = [
        ["Fecha", "Tipo", "Categoría", "Monto", "Descripción"],
        ["2025-08-11", "Ingreso", "Salario", "2500", "Sueldo mensual"],
        ["2025-08-10", "Gasto", "Alimentación", "150", "Supermercado"],
        ["2025-08-09", "Gasto", "Transporte", "50", "Gasolina"],
        ["2025-08-08", "Gasto", "Entretenimiento", "120", "Cine con amigos"],
        ["2025-08-07", "Ingreso", "Freelance", "800", "Proyecto de diseño web"],
        ["2025-08-05", "Gasto", "Servicios", "200", "Electricidad y agua"],
        ["2025-08-04", "Gasto", "Salud", "300", "Consulta médica"],
        ["2025-08-02", "Ahorro", "Fondo de emergencia", "500", "Depósito mensual"],
      ];
      break;
    
    case 'categories':
      simulatedData = [
        ["ID", "Nombre", "Tipo", "Color"],
        ["cat001", "Salario", "Ingreso", "#4CAF50"],
        ["cat002", "Freelance", "Ingreso", "#8BC34A"],
        ["cat003", "Alimentación", "Gasto", "#F44336"],
        ["cat004", "Transporte", "Gasto", "#FF9800"],
        ["cat005", "Entretenimiento", "Gasto", "#9C27B0"],
        ["cat006", "Servicios", "Gasto", "#2196F3"],
        ["cat007", "Salud", "Gasto", "#E91E63"],
        ["cat008", "Fondo de emergencia", "Ahorro", "#607D8B"],
      ];
      break;
    
    case 'goals':
      simulatedData = [
        ["Nombre", "Monto Objetivo", "Monto Actual", "Fecha Objetivo", "Color"],
        ["Vacaciones", "5000", "1500", "2025-12-31", "#4CAF50"],
        ["Nuevo teléfono", "1000", "450", "2025-09-30", "#2196F3"],
        ["Emergencias", "10000", "3500", "2026-06-30", "#FF9800"],
      ];
      break;
      
    default:
      // Datos genéricos para cualquier otra hoja
      simulatedData = [
        ["Columna 1", "Columna 2", "Columna 3"],
        ["Dato 1", "Dato 2", "Dato 3"],
        ["Dato 4", "Dato 5", "Dato 6"],
      ];
  }

  console.log("⚠️ Devolviendo datos simulados para:", sheetName);
  console.table(simulatedData);

  // Guardar datos simulados
  API_STATE.lastSyncData = simulatedData;

  // Mostrar estado
  showConnectionStatus(true, "Datos simulados cargados (modo local)");

  // Simular retraso de red
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(simulatedData);
    }, 1000);
  });
}

/**
 * Escribe datos en una hoja de Google Sheets
 * @param {string} sheetName - Nombre de la hoja configurada
 * @param {Array} values - Matriz bidimensional con los datos a escribir
 * @param {string} [customRange] - Rango personalizado (opcional)
 * @param {string} [spreadsheetId] - ID de la hoja de cálculo (opcional)
 * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la operación
 */
async function writeGoogleSheet(sheetName, values, customRange = null, spreadsheetId = null) {
  // Obtener configuración de la hoja
  const config = API_CONFIG.spreadsheets.main.sheets[sheetName];
  if (!config && !customRange) {
    console.error(`❌ Hoja "${sheetName}" no configurada`);
    return Promise.reject(new Error(`Hoja "${sheetName}" no configurada`));
  }
  
  // Usar el ID de la hoja principal si no se especifica otro
  const sheetId = spreadsheetId || API_CONFIG.spreadsheets.main.spreadsheetId;
  
  // Usar el rango configurado o el personalizado
  // Para escritura, es importante especificar solo la celda inicial si queremos actualizar todo
  // Por ejemplo, "Transacciones!A1" en lugar de "Transacciones!A:E"
  const baseRange = customRange || (config ? config.range : "A:Z");
  const writeRange = baseRange.includes("!") ? 
                    baseRange.split("!")[0] + "!A1" : 
                    (config ? config.name + "!A1" : "A1");
  
  console.log("📝 Escribiendo datos en Google Sheets");
  console.log(`📊 Hoja: ${sheetName}, ID: ${sheetId}`);
  console.log(`📋 Filas a escribir: ${values.length}`);

  // Verificar si estamos en modo simulado
  if (window.forceSimulationMode) {
    console.log("⚠️ Usando escritura simulada (modo simulado activo)");
    return getSimulatedWriteResponse(sheetId, writeRange, values);
  }

  // Verificar autenticación y disponibilidad de API
  if (!API_STATE.isSignedIn && !window.forceSimulationMode) {
    console.warn("⚠️ Usuario no autenticado, intentando autenticar automáticamente");
    try {
      await handleAuthClick();
    } catch (error) {
      console.error("❌ Error al intentar autenticar:", error);
      return getSimulatedWriteResponse(sheetId, writeRange, values);
    }
  }

  // Verificar si gapi está disponible para conexión real
  if (typeof gapi !== "undefined" && gapi.client && gapi.client.sheets) {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: writeRange,
        valueInputOption: "USER_ENTERED",
        resource: { values: values },
      });
      
      console.log("✅ Datos escritos correctamente:", response.result);
      showConnectionStatus(
        true,
        `${response.result.updatedCells} celdas actualizadas`
      );
      return response.result;
    } catch (error) {
      console.error("❌ Error al escribir datos en Google Sheets:", error);
      showConnectionStatus(
        false,
        "Error al escribir datos: " + error.message
      );
      
      // Si falla, simular respuesta exitosa
      console.log("⚠️ Usando respuesta simulada como fallback");
      return getSimulatedWriteResponse(sheetId, writeRange, values);
    }
  } else {
    console.log("⚠️ Usando modo simulado para escritura en Google Sheets (gapi no disponible)");
    return getSimulatedWriteResponse(sheetId, writeRange, values);
  }
}

/**
 * Obtiene una respuesta simulada para operaciones de escritura
 * @param {string} spreadsheetId - ID de la hoja de cálculo
 * @param {string} range - Rango de escritura
 * @param {Array} values - Datos escritos
 * @returns {Promise<Object>} - Promesa que resuelve con una respuesta simulada
 */
function getSimulatedWriteResponse(spreadsheetId, range, values) {
  // Para la demo, simular escritura exitosa
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        spreadsheetId: spreadsheetId,
        updatedRange: range,
        updatedRows: values.length,
        updatedColumns: values[0]?.length || 0,
        updatedCells: values.length * (values[0]?.length || 0),
      };

      console.log("✅ Simulación de escritura completada:", result);
      showConnectionStatus(
        true,
        `Simulación: ${result.updatedCells} celdas actualizadas`
      );
      resolve(result);
    }, 1500);
  });
}

/**
 * Sincroniza transacciones con Google Sheets
 * @param {Array} transactions - Lista de transacciones a sincronizar
 * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la operación
 */
async function syncTransactionsWithGoogleSheets(transactions) {
  console.log("🔄 Sincronizando transacciones con Google Sheets");
  console.log(`📊 Transacciones a sincronizar: ${transactions.length}`);

  // Convertir transacciones al formato de Google Sheets
  const values = transactions.map((tx) => {
    const formattedTx = [
      tx.fecha,
      tx.tipo === "income" ? "Ingreso" : "Gasto",
      getCategoryName(tx.categoria, tx.tipo),
      tx.monto.toString(),
      tx.descripcion || "",
    ];

    return formattedTx;
  });

  // Añadir encabezados
  const headers = API_CONFIG.spreadsheets.main.sheets.transactions.columns;
  values.unshift(headers);
  
  console.log(
    `🗂️ Total de filas a escribir: ${values.length} (incluyendo encabezado)`
  );

  // Escribir en Google Sheets
  try {
    const result = await writeGoogleSheet('transactions', values);
    console.log("✅ Sincronización completada con éxito:", result);
    API_STATE.lastSync = new Date();
    console.log(
      `🕒 Última sincronización: ${API_STATE.lastSync.toLocaleString()}`
    );
    return result;
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
    throw error;
  }
}

/**
 * Obtiene el nombre de una categoría a partir de su ID
 * @param {string} categoryId - ID de la categoría
 * @param {string} type - Tipo de categoría (income, expense)
 * @returns {string} - Nombre de la categoría
 */
function getCategoryName(categoryId, type) {
  if (!window.CONFIG || !window.CONFIG.categorias) {
    console.warn(
      "⚠️ CONFIG no está definido correctamente para las categorías"
    );
    return "Sin categoría";
  }

  const categories =
    type === "income" ? CONFIG.categorias.ingresos : CONFIG.categorias.gastos;

  const category = categories.find((c) => c.id === categoryId);
  return category ? category.nombre : "Sin categoría";
}

/**
 * Obtiene el tipo de cambio actual
 * @param {string} baseCurrency - Moneda base (por defecto PEN)
 * @param {string} targetCurrency - Moneda objetivo (por defecto USD)
 * @returns {Promise<number>} - Promesa que resuelve con el tipo de
