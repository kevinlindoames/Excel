// API para conexión con Google Sheets y otras funcionalidades externas

// Configuraciones para la API
const API_CONFIG = {
  // Credenciales para Google Sheets API (normalmente se obtendrían a través de OAuth)
  clientId: "",
  apiKey: "",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scopes: "https://www.googleapis.com/auth/spreadsheets",

  // Configuración de formularios y hojas de Google
  formulariosGoogle: {
    transacciones: {
      formId: "1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ",
      url: "https://docs.google.com/forms/d/e/1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ/viewform?embedded=true",
      spreadsheetId: "1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4",
    },
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
};

// Inicializar la API de Google
function initGoogleAPI() {
  // Esta función inicializaría la API de Google Sheets
  // Para una implementación real, utilizaríamos la biblioteca gapi de Google

  console.log("Inicializando Google API...");

  // En una implementación completa, este código sería similar a:
  /*
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_CONFIG.apiKey,
            clientId: API_CONFIG.clientId,
            discoveryDocs: API_CONFIG.discoveryDocs,
            scope: API_CONFIG.scopes
        }).then(() => {
            // Inicialización exitosa
            API_STATE.initialized = true;
            
            // Escuchar cambios en el estado de autenticación
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            
            // Manejar el estado de inicio de sesión inicial
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            
            // Notificar a la aplicación que la API está lista
            document.dispatchEvent(new CustomEvent('google-api-ready'));
        }).catch(error => {
            API_STATE.error = error;
            console.error('Error al inicializar la API de Google', error);
        });
    });
    */

  // Para esta demo, simularemos la inicialización
  setTimeout(() => {
    API_STATE.initialized = true;
    document.dispatchEvent(new CustomEvent("google-api-ready"));
  }, 1000);
}

// Actualizar el estado de inicio de sesión
function updateSignInStatus(isSignedIn) {
  API_STATE.isSignedIn = isSignedIn;

  if (isSignedIn) {
    console.log("Usuario ha iniciado sesión en Google");
    // Notificar a la aplicación que el usuario ha iniciado sesión
    document.dispatchEvent(
      new CustomEvent("google-signin-change", { detail: { isSignedIn: true } })
    );
  } else {
    console.log("Usuario no ha iniciado sesión en Google");
    // Notificar a la aplicación que el usuario no ha iniciado sesión
    document.dispatchEvent(
      new CustomEvent("google-signin-change", { detail: { isSignedIn: false } })
    );
  }
}

// Iniciar sesión en Google
function signIn() {
  // En una implementación real:
  // gapi.auth2.getAuthInstance().signIn();

  // Para la demo, simular inicio de sesión
  API_STATE.isSignedIn = true;
  updateSignInStatus(true);
}

// Cerrar sesión en Google
function signOut() {
  // En una implementación real:
  // gapi.auth2.getAuthInstance().signOut();

  // Para la demo, simular cierre de sesión
  API_STATE.isSignedIn = false;
  updateSignInStatus(false);
}

// Crear un formulario de Google
function createGoogleForm(title, description, fields) {
  // Esta función crearía un formulario de Google usando la API de Google Forms
  // No está disponible directamente a través de la API pública,
  // normalmente se implementaría con Google Apps Script

  console.log("Creando formulario de Google:", title);

  // En una implementación real, esto se haría a través de Google Apps Script
  // que ejecutaría código como:
  /*
    function createForm() {
        var form = FormApp.create('Mi Formulario de Control Financiero')
            .setDescription('Formulario para registrar ingresos y gastos');
        
        form.addListItem()
            .setTitle('Tipo de transacción')
            .setChoiceValues(['Ingreso', 'Gasto'])
            .setRequired(true);
        
        form.addListItem()
            .setTitle('Categoría')
            .setChoiceValues(['Salario', 'Alimentación', 'Transporte', ...])
            .setRequired(true);
        
        form.addTextItem()
            .setTitle('Monto')
            .setValidation(FormApp.createTextValidation()
                .requireNumber()
                .setHelpText('Por favor, ingresa un número')
                .build())
            .setRequired(true);
        
        form.addDateItem()
            .setTitle('Fecha')
            .setRequired(true);
        
        form.addTextItem()
            .setTitle('Descripción');
        
        // Vincular a una hoja de cálculo
        var ss = SpreadsheetApp.create('Respuestas - Control Financiero');
        form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
        
        return {
            formId: form.getId(),
            formUrl: form.getPublishedUrl(),
            spreadsheetId: ss.getId()
        };
    }
    */

  // Para la demo, simular la creación del formulario
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        formId: "demo_form_id_" + Date.now(),
        formUrl: "https://docs.google.com/forms/d/e/sample/viewform",
        spreadsheetId: "demo_spreadsheet_id_" + Date.now(),
      });
    }, 2000);
  });
}

// Leer datos de una hoja de Google Sheets
function readGoogleSheet(spreadsheetId, range) {
  // Esta función leería datos de una hoja de Google Sheets
  console.log("Leyendo datos de Google Sheets:", spreadsheetId, range);

  // En una implementación real:
  /*
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range
    }).then(response => {
        const values = response.result.values;
        return values;
    }).catch(error => {
        console.error('Error al leer datos de Google Sheets', error);
        throw error;
    });
    */

  // Devolver solo los encabezados sin datos de prueba
  return new Promise((resolve) => {
    setTimeout(() => {
      const emptyData = [
        ["Fecha", "Tipo", "Categoría", "Monto", "Descripción"],
      ];
      resolve(emptyData);
    }, 1500);
  });
}

// Escribir datos en una hoja de Google Sheets
function writeGoogleSheet(spreadsheetId, range, values) {
  // Esta función escribiría datos en una hoja de Google Sheets
  console.log("Escribiendo datos en Google Sheets:", spreadsheetId, range);

  // En una implementación real:
  /*
    return gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: { values: values }
    }).then(response => {
        return response.result;
    }).catch(error => {
        console.error('Error al escribir datos en Google Sheets', error);
        throw error;
    });
    */

  // Para la demo, simular escritura exitosa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        spreadsheetId: spreadsheetId,
        updatedRange: range,
        updatedRows: values.length,
        updatedColumns: values[0].length,
        updatedCells: values.length * values[0].length,
      });
    }, 1500);
  });
}

// Sincronizar transacciones con Google Sheets
function syncTransactionsWithGoogleSheets(transactions, spreadsheetId) {
  // Esta función sincronizaría las transacciones con Google Sheets
  console.log("Sincronizando transacciones con Google Sheets");

  if (!spreadsheetId) {
    return Promise.reject(
      new Error("No se ha configurado una hoja de cálculo para sincronización")
    );
  }

  // Convertir transacciones al formato de Google Sheets
  const values = transactions.map((tx) => [
    tx.fecha,
    tx.tipo === "income" ? "Ingreso" : "Gasto",
    getCategoryName(tx.categoria, tx.tipo),
    tx.monto.toString(),
    tx.descripcion || "",
  ]);

  // Añadir encabezados
  values.unshift(["Fecha", "Tipo", "Categoría", "Monto", "Descripción"]);

  // Escribir en Google Sheets
  return writeGoogleSheet(spreadsheetId, "Transacciones!A1", values).then(
    (result) => {
      API_STATE.lastSync = new Date();
      return result;
    }
  );
}

// Obtener el nombre de una categoría a partir de su ID
function getCategoryName(categoryId, type) {
  const categories =
    type === "income" ? CONFIG.categorias.ingresos : CONFIG.categorias.gastos;

  const category = categories.find((c) => c.id === categoryId);
  return category ? category.nombre : "Sin categoría";
}

// Obtener el tipo de cambio actual
function getExchangeRate(baseCurrency = "PEN", targetCurrency = "USD") {
  // Esta función obtendría el tipo de cambio actual
  console.log("Obteniendo tipo de cambio:", baseCurrency, "a", targetCurrency);

  return fetch(`${API_CONFIG.endpoints.exchangeRate}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.rates && data.rates[targetCurrency]) {
        return data.rates[targetCurrency];
      }
      throw new Error("No se pudo obtener el tipo de cambio");
    })
    .catch((error) => {
      console.error("Error al obtener tipo de cambio:", error);
      // Devolver un valor predeterminado en caso de error
      return 0.27; // Tipo de cambio aproximado PEN a USD
    });
}

// Configurar integración con Google Drive para copias de seguridad
function setupGoogleDriveBackup() {
  // Esta función configuraría la integración con Google Drive para copias de seguridad
  console.log("Configurando copia de seguridad en Google Drive");

  // En una implementación real, esto utilizaría la API de Google Drive
  // Para la demo, simular configuración exitosa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        configured: true,
        folder: "Control Financiero Backups",
        folderId: "demo_folder_id_" + Date.now(),
      });
    }, 1500);
  });
}

// Crear una copia de seguridad en Google Drive
function createGoogleDriveBackup(data) {
  // Esta función crearía una copia de seguridad en Google Drive
  console.log("Creando copia de seguridad en Google Drive");

  // En una implementación real:
  /*
    const fileContent = JSON.stringify(data);
    const file = new Blob([fileContent], {type: 'application/json'});
    const metadata = {
        name: 'control_financiero_backup_' + new Date().toISOString().slice(0, 10) + '.json',
        mimeType: 'application/json',
        parents: ['folderId'] // ID de la carpeta donde guardar
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);
    
    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
        body: form
    })
    .then(response => response.json())
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error('Error al crear copia de seguridad:', error);
        throw error;
    });
    */

  // Para la demo, simular creación exitosa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "demo_backup_id_" + Date.now(),
        name:
          "control_financiero_backup_" +
          new Date().toISOString().slice(0, 10) +
          ".json",
        mimeType: "application/json",
        size: JSON.stringify(data).length,
      });
    }, 2000);
  });
}

// Restaurar desde una copia de seguridad en Google Drive
function restoreFromGoogleDriveBackup(fileId) {
  // Esta función restauraría datos desde una copia de seguridad en Google Drive
  console.log("Restaurando desde copia de seguridad en Google Drive:", fileId);

  // En una implementación real:
  /*
    return gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
    })
    .then(response => {
        return JSON.parse(response.body);
    })
    .catch(error => {
        console.error('Error al restaurar desde copia de seguridad:', error);
        throw error;
    });
    */

  // Estructura vacía sin datos de ejemplo
  return new Promise((resolve) => {
    setTimeout(() => {
      // Estructura vacía para restaurar
      const backupData = {
        transacciones: [],
        metas: [],
        configuracion: {
          // Configuración básica
        },
      };

      resolve(backupData);
    }, 2000);
  });
}

// Exportar funciones para usar en la aplicación
window.API = {
  init: initGoogleAPI,
  signIn,
  signOut,
  createGoogleForm,
  readGoogleSheet,
  writeGoogleSheet,
  syncTransactionsWithGoogleSheets,
  getExchangeRate,
  setupGoogleDriveBackup,
  createGoogleDriveBackup,
  restoreFromGoogleDriveBackup,
  state: API_STATE,
};
