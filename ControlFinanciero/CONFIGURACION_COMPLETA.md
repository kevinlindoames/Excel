# Configuración Completa de Control Financiero

Este documento contiene toda la información necesaria para configurar correctamente tu aplicación de Control Financiero y conectarla con Google Forms y Google Sheets.

## 1. Estado actual

Tu aplicación está funcionando con:

- IDs de Google Forms y Sheets correctamente configurados
- Service Worker instalado correctamente
- Manifest.json configurado
- Estructura preparada para integración con datos reales

## 2. Conexión con Google Sheets

### 2.1 IDs configurados

Tu aplicación está utilizando los siguientes IDs:

```javascript
// En api.js y main.js
formId: "1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ",
url: "https://docs.google.com/forms/d/e/1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ/viewform?embedded=true",
spreadsheetId: "1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4",
```

### 2.2 Enlaces directos

Para acceder directamente a tus recursos de Google:

- **Formulario Google Forms**: [https://docs.google.com/forms/d/1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ/edit](https://docs.google.com/forms/d/1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ/edit)
- **Hoja de cálculo Google Sheets**: [https://docs.google.com/spreadsheets/d/1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4/](https://docs.google.com/spreadsheets/d/1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4/)

Puedes usar estos enlaces para editar directamente el formulario o la hoja de cálculo cuando necesites hacer cambios en su estructura.

### 2.3 Estructura de tu hoja de cálculo

Tu hoja de Google Sheets tiene la siguiente estructura:

```
| Marca temporal     | Tipo de Transacción | Categoría de Ingreso | Categoría de Gasto | Monto (S/.) | Fecha     | Descripción | Puntuación |
|--------------------|---------------------|----------------------|--------------------|-------------|-----------|-------------|------------|
| 9/8/2025 19:58:22  | Ingreso             | Salario              |                    | 2           | 9/8/2025  | google      |            |
```

## 3. Implementación de la API real de Google Sheets (Versión 2025)

Google Cloud Console ha evolucionado desde sus inicios, pero mantiene un flujo similar para la configuración de APIs y credenciales. A continuación, se detallan los pasos actualizados para 2025:

### 3.1 Crear un proyecto en Google Cloud Console

1. Abre tu navegador e inicia sesión en [Google Cloud Console](https://console.cloud.google.com/)
2. En la barra superior, haz clic en el selector de proyectos > "Nuevo proyecto"
3. Asigna un nombre descriptivo como "Control Financiero Personal"
4. Si tienes múltiples cuentas de facturación, selecciona la adecuada (el proyecto básico es gratuito)
5. Haz clic en "Crear" y espera a que se complete el proceso

### 3.2 Habilitar las APIs necesarias

1. En el menú lateral izquierdo, navega a "APIs y Servicios" > "Biblioteca"
2. La página mostrará una lista de APIs populares y un buscador
3. Busca y habilita las siguientes APIs (una por una):
   - **Google Sheets API** (indispensable)
   - **Identity Services API** (necesaria para la autenticación OAuth)
   - **Google Drive API** (opcional: para implementar copias de seguridad)
4. Para cada API, haz clic en "Habilitar" y espera la confirmación
5. Verifica que las APIs habilitadas aparezcan en "APIs y Servicios" > "APIs habilitadas"

### 3.3 Configurar la pantalla de consentimiento de OAuth

1. En el menú lateral izquierdo, ve a "APIs y Servicios" > "Pantalla de consentimiento de OAuth"
2. **Tipo de usuario**:
   - Selecciona "Externo" (para que cualquier usuario pueda autenticarse)
   - Google mostrará una advertencia sobre el proceso de verificación - no te preocupes, para uso personal/limitado no es necesaria la verificación completa
3. **Información de la aplicación**:

   - Nombre: "Control Financiero Personal"
   - Correo electrónico de asistencia: Tu correo electrónico personal
   - Logo: Puedes omitirlo o subir una imagen representativa (tamaño recomendado: 128x128px)
   - Enlaces de desarrollador:
     - Política de privacidad: No es obligatorio para uso personal
     - Términos de servicio: No es obligatorio para uso personal

4. **Dominios autorizados**:

   - Añade: `control-financiero-personal.netlify.app`
   - También puedes añadir dominios personalizados si usas uno propio

5. **Scopes de autorización**:

   - Haz clic en "Añadir o eliminar scopes"
   - Busca y selecciona:
     - `.../auth/spreadsheets` (acceso a Google Sheets)
     - `.../auth/userinfo.email` (para identificar al usuario)
   - Estos scopes determinan a qué datos de Google puede acceder tu aplicación

6. **Usuarios de prueba**:

   - Añade tu correo electrónico personal
   - Puedes añadir hasta 100 usuarios mientras la app esté en modo de prueba

7. **Revisión y publicación**:
   - Revisa toda la información
   - Haz clic en "Guardar y continuar" en cada sección
   - Finalmente, selecciona "Volver al panel"

### 3.4 Crear credenciales OAuth

1. En el menú lateral, ve a "APIs y Servicios" > "Credenciales"
2. Haz clic en el botón "Crear credenciales" y selecciona "ID de cliente de OAuth"
3. **Tipo de aplicación**:

   - Selecciona "Aplicación web"
   - El asistente te mostrará las opciones específicas para este tipo

4. **Configuración básica**:

   - Nombre: "Control Financiero Web" (puedes usar cualquier nombre descriptivo)
   - Descripción (opcional): "Aplicación para gestión financiera personal"

5. **Orígenes autorizados de JavaScript**:

   - Añade exactamente estas URLs:
   - `https://control-financiero-personal.netlify.app`
   - `http://127.0.0.1:5500`
   - Estos son los dominios desde donde se permitirá iniciar el flujo de OAuth

6. **URIs de redirección autorizados**:

   - Añade exactamente estas URLs:
   - `https://control-financiero-personal.netlify.app/`
   - `http://127.0.0.1:5500/ControlFinanciero/index.html`
   - Estas son las páginas a las que Google redirigirá después de la autenticación

7. Haz clic en "Crear" y se te mostrarán las credenciales:
   - **Client ID**: Un identificador largo (ya configurado en tu archivo api.js)
   - **Client Secret**: Guárdalo en un lugar seguro
   - Haz clic en "Descargar JSON" para guardar una copia de seguridad

### 3.5 Crear API Key

1. En la misma página de "Credenciales", haz clic en "Crear credenciales" > "Clave de API"

2. **Selección de tipo de datos**:

   - Se te preguntará: "¿Qué tipo de datos accederá esta clave?"
   - Selecciona: **"Application data" (Datos de la aplicación)**
   - Esta opción es crucial porque solo necesitamos acceder a las hojas de cálculo, no a datos personales del usuario

3. **Asignar un nombre descriptivo**:

   - Nombre: "Control Financiero Sheets API Key"

4. **Configurar restricciones de seguridad** (muy recomendado):

   - Haz clic en "Restringir clave" (nunca dejes una API Key sin restricciones)

   - **Restricciones de aplicación**:

     - Selecciona "Sitios web HTTP referentes"
     - Añade los patrones de URL exactamente como se muestra:
       - `https://control-financiero-personal.netlify.app/*`
       - `http://127.0.0.1:5500/*`
     - El asterisco al final permite acceso desde cualquier página dentro de esos dominios

   - **Restricciones de API**:
     - Selecciona "Restringir clave a APIs específicas"
     - Marca solo "Google Sheets API"
     - Esto impide que tu clave se use para otros servicios aunque sea comprometida

5. Haz clic en "Guardar" y copia la clave API generada
   - Esta clave debe añadirse en el campo `apiKey` de tu archivo `api.js`
   - Nunca compartas esta clave públicamente ni la incluyas en repositorios públicos

### 3.6 Añadir la API Key a tu aplicación

El archivo `js/api.js` ya está configurado con tu Client ID. Ahora necesitas añadir la API Key que has generado:

1. **Localiza el archivo**:

   - Abre el archivo `js/api.js` en tu editor de código

2. **Ubica la sección de configuración**:

   ```javascript
   const API_CONFIG = {
     // Credenciales para Google Sheets API
     clientId:
       "653709897608-i02vab5kkheq7kd079phkbtl73r4ijei.apps.googleusercontent.com",
     apiKey: "", // ← AQUÍ necesitas añadir tu API Key
     discoveryDocs: [
       "https://sheets.googleapis.com/$discovery/rest?version=v4",
     ],
     scopes: "https://www.googleapis.com/auth/spreadsheets",

     // ID del proyecto en Google Cloud
     projectId: "controlfinanciero-468715",

     // Configuración de formularios y hojas de Google
     formulariosGoogle: {
       transacciones: {
         formId: "1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ",
         url: "https://docs.google.com/forms/d/e/1CnYqEdmfR-zVOJocQ2BUB44MMWEHnEUI313z-KocuhQ/viewform?embedded=true",
         spreadsheetId: "1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4",
       },
     },
   };
   ```

3. **Añade la API Key**:

   - Reemplaza la cadena vacía `""` en el campo `apiKey` con la clave que copiaste
   - Asegúrate de mantener las comillas alrededor de la clave
   - Ejemplo: `apiKey: "AIza9yp1Xt6r8hG5kF3lQ7zW2bC0vN4mJ6sD8eR9",`

4. **Guarda el archivo**:
   - Guarda los cambios en el archivo api.js
   - Esta configuración permite que tu aplicación se comunique con Google Sheets API

### 3.7 Bibliotecas de Google API (Ya implementado)

He añadido las bibliotecas necesarias de Google API en tu archivo `index.html`:

```html
<!-- Google API -->
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://accounts.google.com/gsi/client"></script>

<!-- Scripts -->
<script src="js/api.js"></script>
<script src="js/charts.js"></script>
<script src="js/main.js"></script>
```

También he modificado la función `initApp()` en `main.js` para inicializar la API de Google:

```javascript
// Inicializar la aplicación
function initApp() {
  // Comprobar si hay temas guardados
  checkSavedTheme();

  // Cargar datos almacenados localmente
  loadLocalData();

  // Inicializar eventos
  setupEventListeners();

  // Inicializar la API de Google
  API.init()
    .then(() => {
      console.log("Google API inicializada correctamente");
      // Cargar datos desde Google Sheets (si está configurado)
      syncWithGoogleSheets();
    })
    .catch((error) => {
      console.error("Error al inicializar Google API:", error);
    });

  // Actualizar la interfaz
  updateUI();
}
```

### 3.8 Funcionamiento de la integración con Google Sheets

Modifica la función para usar la API real:

```javascript
// Leer datos de una hoja de Google Sheets
function readGoogleSheet(
  spreadsheetId,
  range = "Respuestas de formulario 1!A:H"
) {
  console.log("Leyendo datos de Google Sheets:", spreadsheetId, range);

  if (!gapi.client || !gapi.client.sheets) {
    return Promise.reject(new Error("Google API no inicializada"));
  }

  return gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: spreadsheetId,
      range: range,
    })
    .then((response) => {
      const values = response.result.values || [];

      // Mapear del formato de Google Sheets al formato de la aplicación
      return values.map((row, index) => {
        if (index === 0) {
          // Encabezado en el formato que espera la aplicación
          return ["Fecha", "Tipo", "Categoría", "Monto", "Descripción"];
        } else {
          // Mapear los datos según la estructura de tu hoja
          return [
            row[5] || "", // Fecha (columna F)
            row[1] || "", // Tipo (columna B)
            row[1] === "Ingreso" ? row[2] || "" : row[3] || "", // Categoría según tipo
            row[4] || "0", // Monto (columna E)
            row[6] || "", // Descripción (columna G)
          ];
        }
      });
    })
    .catch((error) => {
      console.error("Error al leer datos de Google Sheets:", error);
      throw error;
    });
}
```

### 3.9 Probando la integración

Una vez configuradas todas las credenciales, debes probar la integración:

1. **Prueba local**:

   - Abre tu aplicación en el navegador (usando http://127.0.0.1:5500/ControlFinanciero/index.html)
   - Si todo está configurado correctamente, verás un diálogo de Google solicitando permiso
   - Acepta los permisos y la aplicación debería conectarse a tu hoja de cálculo

2. **Verifica la consola del navegador**:

   - Abre las herramientas de desarrollo (F12 o Ctrl+Shift+I)
   - En la pestaña "Console", deberías ver mensajes como:
     - "Google API inicializada correctamente"
     - "Leyendo datos de Google Sheets: [ID]"
   - Si ves errores, revisa la sección de solución de problemas

3. **Verifica los datos**:
   - Si tienes datos en tu hoja de Google Sheets, deberían aparecer en la aplicación
   - Intenta añadir una nueva transacción y verifica que se sincronice correctamente

### 3.10 Gestión de permisos y seguridad

En 2025, la seguridad y privacidad son aspectos críticos. Algunos puntos importantes:

1. **Permisos de usuario**:

   - La primera vez que un usuario utiliza la aplicación, Google mostrará un diálogo de permisos
   - El usuario debe aceptar explícitamente los permisos para acceder a sus hojas de cálculo
   - Los usuarios pueden revocar el acceso en cualquier momento desde su cuenta de Google

2. **Rotación de credenciales**:

   - Por seguridad, Google recomienda rotar las API Keys cada 90 días
   - Puedes programar recordatorios para generar nuevas claves periódicamente
   - Cuando generes una nueva clave, actualiza el archivo api.js y redespliega la aplicación

3. **Monitoreo de uso**:
   - En Google Cloud Console, ve a "APIs y Servicios" > "Panel"
   - Aquí puedes monitorear el uso de tus APIs y detectar actividades inusuales
   - Configura alertas de uso para evitar costos inesperados (aunque el uso básico es gratuito)

Modifica la función `initGoogleAPI()` para usar la API real:

```javascript
// Inicializar la API de Google
function initGoogleAPI() {
  console.log("Inicializando Google API...");

  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_CONFIG.apiKey,
          clientId: API_CONFIG.clientId,
          discoveryDocs: API_CONFIG.discoveryDocs,
          scope: API_CONFIG.scopes,
        })
        .then(() => {
          // Inicialización exitosa
          API_STATE.initialized = true;

          // Escuchar cambios en el estado de autenticación
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

          // Manejar el estado de inicio de sesión inicial
          updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

          // Notificar a la aplicación que la API está lista
          document.dispatchEvent(new CustomEvent("google-api-ready"));
          resolve();
        })
        .catch((error) => {
          API_STATE.error = error;
          console.error("Error al inicializar la API de Google", error);
          reject(error);
        });
    });
  });
}
```

## 4. Modificaciones para sincronización bidireccional

### 4.1 Actualizar la función de sincronización

Modifica la función `syncTransactionsWithGoogleSheets()` para adaptarla a la estructura de tu formulario:

```javascript
// Sincronizar transacciones con Google Sheets
function syncTransactionsWithGoogleSheets(transactions, spreadsheetId) {
  console.log("Sincronizando transacciones con Google Sheets");

  if (!spreadsheetId) {
    return Promise.reject(
      new Error("No se ha configurado una hoja de cálculo para sincronización")
    );
  }

  // Convertir transacciones al formato de tu hoja de Google Sheets
  const values = transactions.map((tx) => {
    const now = new Date().toLocaleString();
    const tipoTransaccion = tx.tipo === "income" ? "Ingreso" : "Gasto";
    const categoriaIngreso =
      tx.tipo === "income" ? getCategoryName(tx.categoria, tx.tipo) : "";
    const categoriaGasto =
      tx.tipo === "expense" ? getCategoryName(tx.categoria, tx.tipo) : "";

    return [
      now, // Marca temporal
      tipoTransaccion, // Tipo de Transacción
      categoriaIngreso, // Categoría de Ingreso
      categoriaGasto, // Categoría de Gasto
      tx.monto.toString(), // Monto (S/.)
      tx.fecha, // Fecha
      tx.descripcion || "", // Descripción
      "", // Puntuación
    ];
  });

  // Añadir encabezados si es necesario
  if (values.length > 0) {
    values.unshift([
      "Marca temporal",
      "Tipo de Transacción",
      "Categoría de Ingreso",
      "Categoría de Gasto",
      "Monto (S/.)",
      "Fecha",
      "Descripción",
      "Puntuación",
    ]);
  }

  // Escribir en Google Sheets
  return writeGoogleSheet(
    spreadsheetId,
    "Respuestas de formulario 1!A1",
    values
  ).then((result) => {
    API_STATE.lastSync = new Date();
    return result;
  });
}
```

### 4.2 Actualizar la función de escritura en Google Sheets

```javascript
// Escribir datos en una hoja de Google Sheets
function writeGoogleSheet(spreadsheetId, range, values) {
  console.log("Escribiendo datos en Google Sheets:", spreadsheetId, range);

  return gapi.client.sheets.spreadsheets.values
    .update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource: { values: values },
    })
    .then((response) => {
      return response.result;
    })
    .catch((error) => {
      console.error("Error al escribir datos en Google Sheets", error);
      throw error;
    });
}
```

## 5. Actualizando en Netlify (2025)

En 2025, Netlify ha mejorado su interfaz, pero mantiene la facilidad de uso que lo caracteriza. Para actualizar tu aplicación:

### 5.1 Método tradicional (arrastrar y soltar)

1. **Preparación**:

   - Asegúrate de que todos tus archivos estén guardados y actualizados
   - Verifica que la API Key esté correctamente configurada en api.js

2. **Acceso a Netlify**:

   - Inicia sesión en [Netlify](https://app.netlify.com/)
   - El nuevo panel unificado mostrará todos tus sitios
   - Localiza y selecciona "Control Financiero Personal"

3. **Despliegue manual**:

   - En la sección principal, selecciona la pestaña "Deploys"
   - Verás la zona de despliegue con el mensaje "Drag and drop your site folder here"
   - Arrastra la carpeta `ControlFinanciero` completa a esta zona
   - Netlify procesará los archivos (normalmente toma menos de 1 minuto)

4. **Verificación**:
   - Cuando aparezca "Deploy published", haz clic en "Preview" para ver tu sitio
   - Verifica que puedas autenticarte con Google y que la sincronización funcione

### 5.2 Método automatizado (opcional)

Netlify ahora ofrece opciones más avanzadas para despliegues automatizados:

1. **Conexión con repositorio Git**:

   - Si utilizas GitHub, GitLab o Bitbucket, puedes conectar tu repositorio
   - Netlify desplegará automáticamente cada vez que hagas un commit

2. **Netlify CLI** (para usuarios avanzados):

   - Instala Netlify CLI: `npm install -g netlify-cli`
   - Configura tu sitio: `netlify link`
   - Despliega con un comando: `netlify deploy --prod`

3. **Verificación de despliegue**:
   - Netlify ahora realiza comprobaciones automáticas después de cada despliegue
   - Verifica que las URLs funcionen y que no haya errores críticos
   - Puedes configurar pruebas personalizadas en el panel de configuración

## 6. Solución de problemas comunes (2025)

### 6.1 Problemas de autenticación

#### Error: "No se ha podido inicializar la API de Google"

- **Causa**: Credenciales incorrectas o APIs no habilitadas
- **Solución**:
  1. Verifica que el Client ID en api.js coincida exactamente con el de Google Cloud Console
  2. Asegúrate de que la API Key esté correctamente configurada y no tenga espacios extra
  3. Confirma que las APIs (Google Sheets, Identity Services) estén habilitadas
  4. Revisa la consola del navegador para mensajes de error específicos

#### Error: "El usuario no ha concedido los permisos necesarios"

- **Causa**: Falta autorización del usuario o scopes incorrectos
- **Solución**:
  1. Verifica que el usuario haya completado el flujo de autorización de OAuth
  2. Comprueba que los scopes configurados en api.js (`scopes`) coincidan con los permitidos en la pantalla de consentimiento
  3. Si el usuario rechazó los permisos, debe volver a intentar y aceptarlos
  4. Puedes probar con `API.signIn()` para iniciar manualmente el flujo de autorización

### 6.2 Problemas con Google Sheets

#### Error: "No se puede encontrar la hoja de cálculo"

- **Causa**: ID incorrecto o permisos insuficientes
- **Solución**:
  1. Verifica que el ID de la hoja en api.js sea correcto (el ID largo de la URL)
  2. Asegúrate de que la hoja esté compartida con la cuenta del usuario (mínimo con permisos de lectura)
  3. Intenta abrir la hoja directamente con el enlace para confirmar el acceso
  4. Revisa si hay restricciones organizacionales (algunos dominios corporativos limitan el acceso a Google Sheets)

#### Error: "Los datos no aparecen en la aplicación"

- **Causa**: Problema de mapeo o estructura de datos
- **Solución**:
  1. Comprueba la consola del navegador para errores detallados
  2. Verifica que la estructura de tu hoja coincida con lo esperado por la aplicación
  3. Añade registros temporales (console.log) en la función `readGoogleSheet()` para ver qué datos se reciben
  4. Si la estructura de tu hoja ha cambiado, actualiza el mapeo en la función `readGoogleSheet()`

### 6.3 Problemas de despliegue

#### Error: "Cambios no visibles después del despliegue"

- **Causa**: Caché del navegador o despliegue incompleto
- **Solución**:
  1. Fuerza una recarga completa (Ctrl+F5 o Cmd+Shift+R)
  2. Verifica en Netlify que el despliegue se completó correctamente
  3. Revisa los logs de despliegue en Netlify para errores
  4. Prueba en un navegador diferente o en modo incógnito

#### Error: "CORS o problemas de seguridad"

- **Causa**: Restricciones de seguridad del navegador
- **Solución**:
  1. Verifica que los dominios estén correctamente configurados en Google Cloud Console
  2. Comprueba que el protocolo sea correcto (https para producción)
  3. Revisa la consola del navegador para mensajes específicos de CORS
  4. Asegúrate de que la API Key tenga las restricciones de referrer correctas

### 6.4 Herramienta de diagnóstico 2025

Google ahora proporciona una herramienta de diagnóstico para APIs:

1. Ve a Google Cloud Console > APIs y Servicios > Herramienta de diagnóstico
2. Selecciona "Google Sheets API"
3. Introduce el ID de tu hoja y la cuenta de usuario
4. La herramienta realizará pruebas y sugerirá soluciones específicas

## 7. Recursos adicionales (2025)

### 7.1 Documentación oficial

- [Centro de desarrolladores de Google Workspace](https://developers.google.com/workspace) - Portal unificado para todas las APIs de Google
- [Documentación de Google Sheets API v5](https://developers.google.com/sheets/api/guides/concepts) - Guía actualizada con ejemplos modernos
- [Guía de autenticación OAuth 2.0 con JWT](https://developers.google.com/identity/protocols/oauth2) - Métodos actualizados de autenticación
- [Biblioteca JavaScript de Google API](https://github.com/google/google-api-javascript-client) - Repositorio oficial con ejemplos

### 7.2 Herramientas útiles

- [Google Cloud Shell](https://cloud.google.com/shell) - Entorno de desarrollo en la nube para probar APIs
- [API Explorer para Google Sheets](https://developers.google.com/sheets/api/reference/rest) - Herramienta interactiva para probar llamadas API
- [OAuth Playground](https://developers.google.com/oauthplayground) - Para probar flujos de autenticación
- [Calculadora de costos de Google Cloud](https://cloud.google.com/products/calculator) - Para estimar gastos (la mayoría de usos personales son gratuitos)

### 7.3 Comunidad y soporte

- [Stack Overflow - Tag google-sheets-api](https://stackoverflow.com/questions/tagged/google-sheets-api) - Preguntas y respuestas de la comunidad
- [Google Cloud Community](https://cloud.google.com/community) - Foros oficiales y grupos de usuarios
- [Canal de YouTube de Google Developers](https://www.youtube.com/googlecode) - Tutoriales y sesiones técnicas
- [GitHub Copilot X](https://github.com/features/copilot) - Asistente de código con soporte específico para APIs de Google

### 7.4 Alternativas y complementos (2025)

- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) - Alternativa si necesitas sincronización en tiempo real
- [Google AppSheet](https://cloud.google.com/appsheet) - Creación de apps sin código integradas con Google Sheets
- [Data Studio (ahora Looker Studio Pro)](https://lookerstudio.google.com/) - Visualizaciones avanzadas conectadas directamente a Google Sheets
- [AI Sheets Assistant](https://workspace.google.com/features/sheets/) - Nuevas funciones de IA para análisis de datos en Sheets
