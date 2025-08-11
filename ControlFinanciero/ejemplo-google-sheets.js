/**
 * Ejemplo completo de integración con Google Sheets API basado en la documentación oficial
 * Fuente: https://developers.google.com/workspace/sheets/api/quickstart/js
 */

// Configuración de la API de Google Sheets
const CONFIG = {
  // Reemplaza estos valores con tus credenciales de API de Google Cloud
  // Debes crear estas credenciales en la consola de Google Cloud
  API_KEY: "TU_API_KEY", // Reemplazar con tu API key
  CLIENT_ID: "TU_CLIENT_ID", // Reemplazar con tu Client ID

  // URL de documentación de descubrimiento para la API
  DISCOVERY_DOC: "https://sheets.googleapis.com/$discovery/rest?version=v4",

  // Permisos necesarios
  // https://www.googleapis.com/auth/spreadsheets.readonly - solo lectura
  // https://www.googleapis.com/auth/spreadsheets - lectura y escritura
  SCOPES: "https://www.googleapis.com/auth/spreadsheets",

  // ID de la hoja de cálculo (se encuentra en la URL)
  // Ejemplo: https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
  SPREADSHEET_ID: "TU_SPREADSHEET_ID",

  // Rango a leer o escribir (por ejemplo 'Hoja1!A1:E10')
  RANGE: "Hoja1!A1:E10",
};

// Variables de estado global
let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback después de que api.js se ha cargado.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback después de que el cliente API se ha cargado.
 * Carga el documento de descubrimiento para inicializar la API.
 */
async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: CONFIG.API_KEY,
      discoveryDocs: [CONFIG.DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  } catch (err) {
    console.error("Error al inicializar gapi.client:", err);
    document.getElementById("error-message").textContent =
      "Error al inicializar Google API: " + err.message;
  }
}

/**
 * Callback después de que Google Identity Services se ha cargado.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.CLIENT_ID,
    scope: CONFIG.SCOPES,
    callback: "", // Definido en handleAuthClick
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Habilita los botones de interacción después de que todas las bibliotecas están cargadas.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize-button").style.display = "block";
  }
}

/**
 * Maneja el inicio de sesión en Google al hacer clic en el botón.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }

    document.getElementById("signout-button").style.display = "block";
    document.getElementById("authorize-button").innerText =
      "Actualizar autorización";

    document.getElementById("content").style.display = "block";
    await listData(); // Llama a la función para mostrar datos
  };

  if (gapi.client.getToken() === null) {
    // Solicita al usuario que seleccione una cuenta de Google
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Omite la selección de cuenta si ya hay una sesión activa
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 * Maneja el cierre de sesión al hacer clic en el botón.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").style.display = "none";
    document.getElementById("authorize-button").innerText = "Autorizar";
    document.getElementById("signout-button").style.display = "none";
  }
}

/**
 * Lee datos de la hoja de cálculo y los muestra.
 */
async function listData() {
  try {
    // Mostrar mensaje de carga
    document.getElementById("content").innerHTML = "Cargando datos...";

    // Llamada a la API para obtener los valores
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      range: CONFIG.RANGE,
    });

    // Procesar los datos
    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
      document.getElementById("content").innerHTML = "No se encontraron datos.";
      return;
    }

    // Crear tabla HTML para mostrar los datos
    let output = '<table class="data-table"><thead><tr>';

    // Encabezados (primera fila)
    range.values[0].forEach((header) => {
      output += `<th>${header}</th>`;
    });
    output += "</tr></thead><tbody>";

    // Datos (filas restantes)
    for (let i = 1; i < range.values.length; i++) {
      output += "<tr>";
      // Rellenar con celdas vacías si hay menos columnas que encabezados
      const row = range.values[i];
      for (let j = 0; j < range.values[0].length; j++) {
        output += `<td>${j < row.length ? row[j] : ""}</td>`;
      }
      output += "</tr>";
    }
    output += "</tbody></table>";

    // Mostrar la tabla
    document.getElementById("content").innerHTML = output;
  } catch (err) {
    document.getElementById("content").innerText = "Error: " + err.message;
    console.error("Error al obtener datos de la hoja de cálculo:", err);
  }
}

/**
 * Escribe datos en la hoja de cálculo.
 * @param {Array} values - Array bidimensional con los datos a escribir
 */
async function writeData(values) {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      range: CONFIG.RANGE,
      valueInputOption: "USER_ENTERED", // Interpreta formato de usuario
      resource: {
        values: values,
      },
    });

    console.log("Datos escritos:", response.result);
    alert(
      `Datos actualizados. ${response.result.updatedCells} celdas actualizadas.`
    );

    // Actualizar vista
    await listData();
  } catch (err) {
    console.error("Error al escribir datos en la hoja de cálculo:", err);
    alert("Error al escribir datos: " + err.message);
  }
}

/**
 * Añadir una fila a la hoja de cálculo.
 * Ejemplo de cómo podría integrarse con un formulario.
 */
async function addRow(event) {
  event.preventDefault(); // Evitar envío del formulario

  // Obtener datos del formulario
  const fecha = document.getElementById("input-fecha").value;
  const tipo = document.getElementById("input-tipo").value;
  const categoria = document.getElementById("input-categoria").value;
  const monto = document.getElementById("input-monto").value;
  const descripcion = document.getElementById("input-descripcion").value;

  // Crear array con la nueva fila
  const newRow = [fecha, tipo, categoria, monto, descripcion];

  try {
    // Primero leemos los datos actuales para saber dónde añadir
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      range: CONFIG.RANGE,
    });

    const currentValues = response.result.values || [];

    // Si no hay datos, creamos una fila de encabezado primero
    if (currentValues.length === 0) {
      currentValues.push([
        "Fecha",
        "Tipo",
        "Categoría",
        "Monto",
        "Descripción",
      ]);
    }

    // Añadir la nueva fila
    currentValues.push(newRow);

    // Escribir todos los datos de vuelta
    await writeData(currentValues);

    // Limpiar formulario
    document.getElementById("add-row-form").reset();
  } catch (err) {
    console.error("Error al añadir fila:", err);
    alert("Error al añadir fila: " + err.message);
  }
}

/**
 * Inicializar la aplicación
 */
document.addEventListener("DOMContentLoaded", function () {
  // Puedes agregar aquí cualquier código de inicialización adicional

  // Ejemplo: asociar el envío del formulario a la función addRow
  const form = document.getElementById("add-row-form");
  if (form) {
    form.addEventListener("submit", addRow);
  }
});

/**
 * HTML mínimo necesario para usar este script:
 *
 * <button id="authorize-button" style="display: none;">Autorizar</button>
 * <button id="signout-button" style="display: none;">Cerrar sesión</button>
 * <div id="error-message"></div>
 * <div id="content" style="display: none;"></div>
 *
 * <form id="add-row-form">
 *   <input id="input-fecha" type="date" required>
 *   <select id="input-tipo" required>
 *     <option value="Ingreso">Ingreso</option>
 *     <option value="Gasto">Gasto</option>
 *   </select>
 *   <input id="input-categoria" required>
 *   <input id="input-monto" type="number" step="0.01" min="0" required>
 *   <input id="input-descripcion">
 *   <button type="submit">Añadir</button>
 * </form>
 *
 * <!-- Load the API and auth libraries -->
 * <script src="https://apis.google.com/js/api.js" onload="gapiLoaded()"></script>
 * <script src="https://accounts.google.com/gsi/client" onload="gisLoaded()"></script>
 */
