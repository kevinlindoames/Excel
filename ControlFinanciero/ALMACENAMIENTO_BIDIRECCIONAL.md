# Almacenamiento Bidireccional en Google Sheets

## Aclaración Importante

Entiendo que quieres que **todos los datos se almacenen en la misma hoja de cálculo** independientemente de dónde los ingreses (Google Forms o aplicación web). Vamos a aclarar cómo funciona este proceso:

## Estado Actual de la Aplicación

### 1. Datos ingresados desde Google Forms

- Cuando ingresas datos a través del formulario de Google, estos se guardan **automáticamente** en la hoja de cálculo vinculada:
  - `https://docs.google.com/spreadsheets/d/1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4/`

### 2. Datos ingresados desde la aplicación web

- Actualmente, cuando ingresas datos directamente en la aplicación web (usando el "Formulario Rápido"), estos se guardan **localmente** en el navegador.
- La aplicación tiene una función `syncTransactionsWithGoogleSheets()` que podría enviar estos datos a Google Sheets, pero necesita ser llamada explícitamente.

## Modificación Necesaria

Para que todos los datos (tanto de Google Forms como de la aplicación web) se almacenen en la misma hoja de cálculo, es necesario modificar la aplicación para que:

1. Cada vez que se ingrese un dato en la aplicación web, este se envíe automáticamente a Google Sheets.
2. O alternativamente, añadir un botón específico para "Enviar a Google Sheets" los datos ingresados localmente.

## Cómo Implementar esta Modificación

### Opción 1: Sincronización Automática

Modifica el archivo `js/main.js` para que después de guardar una transacción localmente, llame a la función `syncTransactionsWithGoogleSheets()`:

```javascript
// Busca la función que maneja el envío del formulario local
formTransaction.addEventListener("submit", function (e) {
  e.preventDefault();

  // Código existente para guardar la transacción localmente
  // ...

  // Añadir después de guardar localmente:
  // Sincronizar con Google Sheets
  const spreadsheetId =
    API_CONFIG.formulariosGoogle.transacciones.spreadsheetId;
  API.syncTransactionsWithGoogleSheets(getAllTransactions(), spreadsheetId)
    .then(() => {
      showNotification("Datos sincronizados con Google Sheets", "success");
    })
    .catch((error) => {
      console.error("Error al sincronizar:", error);
      showNotification("Error al sincronizar con Google Sheets", "error");
    });
});
```

### Opción 2: Botón de Sincronización Explícito

Añadir un botón específico en la interfaz para enviar los datos locales a Google Sheets:

```html
<!-- Añadir en el archivo index.html, cerca del botón de Nueva Transacción -->
<button id="sync-to-sheets" class="btn secondary">
  <i class="fas fa-cloud-upload-alt"></i> Enviar a Google Sheets
</button>
```

Y luego añadir el código JavaScript correspondiente:

```javascript
// Añadir en main.js
document
  .getElementById("sync-to-sheets")
  .addEventListener("click", function () {
    const spreadsheetId =
      API_CONFIG.formulariosGoogle.transacciones.spreadsheetId;
    API.syncTransactionsWithGoogleSheets(getAllTransactions(), spreadsheetId)
      .then(() => {
        showNotification("Datos sincronizados con Google Sheets", "success");
      })
      .catch((error) => {
        console.error("Error al sincronizar:", error);
        showNotification("Error al sincronizar con Google Sheets", "error");
      });
  });
```

## Flujo de Datos Bidireccional Resultante

Con esta modificación, el flujo de datos sería:

```
1. Datos desde Google Forms → Google Sheets
2. Datos desde la aplicación web → Google Sheets
3. Google Sheets → Aplicación web (al sincronizar)
```

De esta manera, **todos los datos se almacenarán en la misma hoja de cálculo** independientemente de dónde los ingreses, y la aplicación web podrá mostrar todos estos datos después de sincronizar.

## Implementación Recomendada

La **Opción 2 (Botón de Sincronización Explícito)** es generalmente más recomendable porque:

1. Da más control al usuario sobre cuándo enviar los datos a Google Sheets
2. Evita problemas si el usuario está trabajando sin conexión a internet
3. Permite agrupar múltiples transacciones antes de enviarlas

Sin embargo, si prefieres que todo sea automático, la Opción 1 también es viable.

## Nota sobre Permisos

Para que la aplicación pueda escribir en tu hoja de cálculo de Google, necesitarás:

1. Asegurarte de que la hoja tenga los permisos adecuados
2. Posiblemente autorizar la aplicación para acceder a tu cuenta de Google
3. Manejar tokens de autenticación (OAuth) si se implementa completamente

En la implementación actual simulada, estos pasos pueden no ser necesarios, pero en una implementación real con la API de Google Sheets, serían esenciales.
