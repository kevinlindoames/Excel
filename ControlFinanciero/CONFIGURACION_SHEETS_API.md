# Configuración de Google Sheets API para Control Financiero

Esta guía te ayudará a configurar correctamente la integración con Google Sheets API para que puedas almacenar y recuperar tus datos financieros en la nube.

## 1. Crear un proyecto en Google Cloud

1. Ve a la [Consola de Google Cloud](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el ID del proyecto (lo necesitarás más adelante)

## 2. Habilitar la API de Google Sheets

1. En la consola de Google Cloud, ve a "APIs y servicios" > "Biblioteca"
2. Busca "Google Sheets API" y selecciónala
3. Haz clic en "Habilitar"

## 3. Crear credenciales para la API

### Crear una clave de API

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "Clave de API"
3. Aparecerá una ventana con tu nueva clave de API. Cópiala y guárdala en un lugar seguro.
4. (Recomendado) Haz clic en "Restringir clave" para limitar su uso solo a la API de Google Sheets

### Crear un ID de cliente OAuth

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente de OAuth"
3. Selecciona "Aplicación web" como tipo de aplicación
4. Asigna un nombre a tu aplicación
5. En "Orígenes de JavaScript autorizados", añade `http://localhost:8080` (para desarrollo local) y cualquier otro dominio donde planees alojar tu aplicación
6. Haz clic en "Crear"
7. Aparecerá una ventana con tu ID de cliente y tu secreto de cliente. Copia el ID de cliente.

## 4. Configurar la pantalla de consentimiento OAuth

1. Ve a "APIs y servicios" > "Pantalla de consentimiento de OAuth"
2. Selecciona "Externo" si estás desarrollando para uso personal, o "Interno" si es para una organización
3. Completa la información básica:

   - Nombre de la aplicación
   - Correo electrónico de soporte
   - Logo (opcional)
   - Dominios autorizados (ver nota especial abajo)

4. Añade el ámbito `https://www.googleapis.com/auth/spreadsheets` para permitir acceso a Google Sheets
5. Añade usuarios de prueba (tu correo electrónico) si tu aplicación está en modo desarrollo

### Nota sobre Dominios autorizados

Para la sección "Dominios autorizados" en la pantalla de consentimiento OAuth:

- **NO puedes usar** `localhost` directamente, ya que Google exige dominios de nivel superior válidos
- En su lugar, puedes utilizar:
  - `test-[tuapellido].com` (por ejemplo, `test-perez.com`)
  - Cualquier dominio real que poseas
  - Un dominio de prueba como `example.com` o `yourdomain.test`

Importante: El dominio autorizado aquí es solo para la pantalla de consentimiento y es diferente de los "Orígenes JavaScript autorizados" que configuraste en el paso anterior. Los orígenes JavaScript son los que realmente importan para el funcionamiento de la aplicación.

## 5. Crear una hoja de cálculo para almacenar los datos

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo
2. Renombra la primera hoja como "Transacciones"
3. (Opcional) Añade encabezados en la primera fila: "Fecha", "Tipo", "Categoría", "Monto", "Descripción"
4. Copia el ID de la hoja de cálculo desde la URL:
   - La URL será algo como: `https://docs.google.com/spreadsheets/d/TU_ID_DE_HOJA_DE_CALCULO/edit`
   - El ID es la parte `TU_ID_DE_HOJA_DE_CALCULO` en la URL

## 6. Configurar la aplicación

Abre el archivo `ControlFinanciero/js/api.js` y actualiza las siguientes constantes con tus credenciales:

```javascript
const API_CONFIG = {
  // Credenciales para Google Sheets API
  clientId: "TU_ID_DE_CLIENTE",
  apiKey: "TU_CLAVE_DE_API",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scopes: "https://www.googleapis.com/auth/spreadsheets",

  // ID del proyecto en Google Cloud
  projectId: "TU_ID_DE_PROYECTO",

  // Configuración de hojas de Google
  formulariosGoogle: {
    transacciones: {
      spreadsheetId: "TU_ID_DE_HOJA_DE_CALCULO",
    },
  },
};
```

## 7. Probar la conexión

1. Abre la aplicación en tu navegador
2. Haz clic en el botón "Probar Conexión" en el pie de página
3. Si todo está configurado correctamente:
   - Se te pedirá que inicies sesión con tu cuenta de Google (la primera vez)
   - Aparecerá un modal mostrando los datos de tu hoja de cálculo
   - Verás un mensaje de estado verde indicando que la conexión fue exitosa

## Solución de problemas

### Error: "API key not valid. Please pass a valid API key."

- Verifica que hayas copiado correctamente tu clave de API
- Asegúrate de que la API de Google Sheets esté habilitada para tu proyecto

### Error: "Invalid client ID"

- Verifica que hayas copiado correctamente tu ID de cliente
- Asegúrate de que los orígenes autorizados incluyan la URL desde donde estás accediendo

### Error: "Access denied"

- Verifica que hayas incluido el ámbito `https://www.googleapis.com/auth/spreadsheets` en tu proyecto
- Asegúrate de que tu cuenta de usuario tenga acceso a la hoja de cálculo
- Comprueba que hayas añadido tu correo como usuario de prueba si estás en modo desarrollo

### Error: "Dominio no válido" en la pantalla de consentimiento

- No puedes usar `localhost` como dominio autorizado
- Usa un dominio de prueba como se explica en la sección "Nota sobre Dominios autorizados"
- Recuerda que los dominios autorizados de la pantalla de consentimiento son diferentes de los orígenes JavaScript autorizados

### Error: "The API returned an error: Requested entity was not found."

- Verifica que el ID de la hoja de cálculo sea correcto
- Asegúrate de que la hoja de cálculo exista y sea accesible con tu cuenta

## Notas adicionales

- La aplicación utiliza un modo simulado cuando no puede conectarse a Google Sheets para permitir el desarrollo sin conexión
- Para usar la aplicación en producción, deberás:
  1. Publicar tu proyecto en Google Cloud Console
  2. Actualizar los orígenes autorizados con tu dominio final
  3. Obtener verificación de Google si planeas que múltiples usuarios accedan a la aplicación
- Si tu aplicación es solo para uso personal o para un grupo limitado de usuarios de prueba, puedes mantenerla en modo "Testing" sin necesidad de verificación
