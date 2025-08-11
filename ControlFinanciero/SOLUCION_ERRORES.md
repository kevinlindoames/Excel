# Solución de Errores Comunes en la Integración con Google Sheets

Este documento proporciona soluciones detalladas para los errores más comunes encontrados al integrar nuestra aplicación con Google Sheets.

## Error 1: idpiframe_initialization_failed

**Mensaje de error:**

```
Error: idpiframe_initialization_failed
Details: You have created a new client application that uses libraries for user authentication or authorization that are deprecated. New clients must use the new libraries instead. See the Migration Guide for more information.
```

**Causa:**
Google está eliminando gradualmente la biblioteca antigua `gapi.auth2` en favor de la nueva Google Identity Services (GIS).

**Solución:**

1. Actualiza las bibliotecas de autenticación en tu proyecto:
   - Reemplaza los scripts de carga actuales por los nuevos:

```html
<!-- Eliminar o comentar estas líneas -->
<!-- <script src="https://apis.google.com/js/api.js"></script> -->
<!-- <script src="https://accounts.google.com/gsi/client"></script> -->

<!-- Agregar estas líneas en su lugar -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script src="https://apis.google.com/js/api.js"></script>
```

2. Actualiza la configuración en Google Cloud Console:

   - Ve a "APIs y servicios" > "Pantalla de consentimiento de OAuth"
   - Asegúrate de que el tipo de aplicación sea "Web"
   - Verifica que los dominios autorizados y orígenes JavaScript sean correctos

3. Si necesitas ayuda técnica específica, puedes encontrar la [Guía de Migración oficial de Google](https://developers.google.com/identity/gsi/web/guides/gis-migration).

## Error 2: PERMISSION_DENIED (403)

**Mensaje de error:**

```
Error: The caller does not have permission
Status: PERMISSION_DENIED
Code: 403
```

**Causa:**
Este error ocurre porque la aplicación no tiene permisos para acceder a la hoja de cálculo específica. Puede deberse a varias razones:

**Solución:**

1. Verifica que la hoja de cálculo esté compartida con tu cuenta:

   - Abre manualmente la hoja de cálculo con el ID proporcionado
   - Si no puedes acceder, significa que no tienes permisos para verla
   - Pide al propietario que la comparta contigo o usa una hoja de cálculo propia

2. Comprueba que estás iniciado sesión con la cuenta correcta:

   - La cuenta con la que inicias sesión en la aplicación debe tener acceso a la hoja
   - Cierra sesión y vuelve a iniciar sesión si es necesario

3. Verifica que la API esté habilitada:

   - Ve a la consola de Google Cloud
   - Asegúrate de que la API de Google Sheets esté habilitada para tu proyecto

4. Comprueba los ámbitos (scopes):

   - Asegúrate de solicitar el ámbito correcto: `https://www.googleapis.com/auth/spreadsheets`
   - Para solo lectura, puedes usar: `https://www.googleapis.com/auth/spreadsheets.readonly`

5. Considera utilizar una hoja de cálculo nueva:
   - Crea una nueva hoja de cálculo desde tu cuenta
   - Copia su ID desde la URL
   - Actualiza el ID en la configuración de la aplicación

## Error 3: Celdas no actualizadas o datos no cargados

**Síntomas:**

- No aparecen errores, pero los datos no se cargan o no se guardan
- La tabla aparece vacía o incompleta

**Causas posibles:**

1. Nombre de hoja incorrecto en el rango
2. Formato de datos incompatible
3. Problemas de caché

**Solución:**

1. Verifica el nombre exacto de la hoja:

   - El nombre debe coincidir exactamente, incluyendo mayúsculas y espacios
   - El formato correcto es: `NombreHoja!A1:E10`
   - Si no especificas un rango, usa: `NombreHoja!A:Z` para obtener todas las columnas

2. Comprueba que el formato de datos sea correcto:

   - Los valores deben ser strings o números simples
   - Evita estructuras de datos complejas que no puedan serializarse correctamente

3. Limpia la caché y los datos almacenados:
   - Borra la caché del navegador
   - Prueba en una ventana de incógnito

## Probar la conexión con modo simulado

Si continúas teniendo problemas, puedes utilizar el modo simulado para desarrollo:

1. Añade esta línea antes de cualquier otro código en tu archivo `api.js`:

```javascript
window.forceSimulationMode = true;
```

2. Modifica la función `initGoogleAPI()` para que siempre use el modo simulado:

```javascript
function initGoogleAPI() {
  console.log("📡 Inicializando Google API en modo simulado...");
  // Resto del código del modo simulado
}
```

Esto te permitirá seguir desarrollando la aplicación mientras resuelves los problemas de conexión con Google Sheets.

## Herramientas de diagnóstico

Para obtener más información sobre los errores, puedes utilizar las siguientes herramientas:

1. **Consola del navegador**: Abre las herramientas de desarrollo (F12) y revisa la pestaña "Console" para ver mensajes de error detallados.

2. **Depurador de red**: Usa la pestaña "Network" en las herramientas de desarrollo para ver las solicitudes HTTP y sus respuestas.

3. **OAuth Playground**: Visita [Google OAuth Playground](https://developers.google.com/oauthplayground/) para probar tus credenciales y permisos.

4. **API Explorer**: Usa el [Google Sheets API Explorer](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get) para probar llamadas API específicas.
