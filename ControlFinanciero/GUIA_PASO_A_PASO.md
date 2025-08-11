# Guía Paso a Paso: Integración con Google Sheets

Esta guía te llevará a través de los pasos necesarios para integrar completamente tu aplicación de Control Financiero con Google Sheets, permitiéndote almacenar tus transacciones en la nube y acceder a ellas desde cualquier dispositivo.

## Preparación inicial

### 1. Configuración de Google Cloud y API de Google Sheets

Primero, necesitas configurar el acceso a la API de Google Sheets:

1. Sigue las instrucciones en `CONFIGURACION_SHEETS_API.md` para:

   - Crear un proyecto en Google Cloud
   - Habilitar la API de Google Sheets
   - Generar las credenciales necesarias (API key y Client ID)
   - Configurar la pantalla de consentimiento OAuth
   - Crear una hoja de cálculo para almacenar tus datos

2. Actualiza el archivo `js/api.js` con tus credenciales e ID de hoja de cálculo

### 2. Preparación del entorno local

1. Asegúrate de tener instalado un servidor web local como http-server:

   ```
   npm install -g http-server
   ```

2. Inicia el servidor desde la carpeta del proyecto:
   ```
   npx http-server ControlFinanciero -o
   ```

## Uso de la integración con Google Sheets

### 1. Autorización inicial

La primera vez que uses la aplicación con Google Sheets:

1. Abre la aplicación en tu navegador
2. Haz clic en el botón "Probar Conexión" en el pie de página
3. Aparecerá un diálogo de Google solicitando permiso para acceder a tus hojas de cálculo
4. Inicia sesión con tu cuenta de Google y autoriza la aplicación
5. Si todo está correcto, verás un modal mostrando los datos de tu hoja de cálculo (que estará vacía inicialmente)

### 2. Agregar transacciones

Hay dos formas de agregar transacciones que se sincronizarán con Google Sheets:

#### Usando el formulario de la aplicación:

1. Haz clic en "Nueva Transacción" en la página principal
2. Completa el formulario con los detalles de tu ingreso o gasto
3. Haz clic en "Guardar"
4. Los datos se guardarán localmente y también se sincronizarán con Google Sheets

#### Usando Google Forms (opcional):

Si has configurado un formulario de Google Forms vinculado a tu hoja de cálculo:

1. Haz clic en "Nueva Transacción" en la página principal
2. Cambia a la pestaña "Google Forms"
3. Completa el formulario de Google directamente desde la aplicación
4. Los datos se enviarán a Google Sheets y se importarán a la aplicación en la próxima sincronización

### 3. Sincronización manual

Si has agregado datos directamente a la hoja de cálculo o quieres asegurarte de tener los datos más recientes:

1. Haz clic en el botón "Probar Conexión" en el pie de página
2. Esto leerá los datos actuales de Google Sheets
3. Si deseas importar estos datos a la aplicación, podrás hacerlo desde la opción "Importar datos" (función que deberás implementar según tus necesidades)

### 4. Exportación manual de datos

Para guardar explícitamente todos los datos locales en Google Sheets:

1. Haz clic en el botón "Exportar Datos" en el pie de página
2. Selecciona "Google Sheets" como destino
3. Confirma la operación
4. Todos los datos se enviarán a Google Sheets, actualizando o añadiendo filas según sea necesario

## Estructura de datos en Google Sheets

### Hoja "Transacciones"

La aplicación espera una hoja llamada "Transacciones" con los siguientes encabezados en la primera fila:

| Fecha      | Tipo    | Categoría    | Monto | Descripción    |
| ---------- | ------- | ------------ | ----- | -------------- |
| 2025-08-01 | Ingreso | Salario      | 2500  | Sueldo mensual |
| 2025-08-02 | Gasto   | Alimentación | 150   | Supermercado   |

Notas sobre el formato:

- **Fecha**: Formato YYYY-MM-DD
- **Tipo**: "Ingreso" o "Gasto"
- **Categoría**: Nombre de la categoría (debe coincidir con las categorías configuradas en la aplicación)
- **Monto**: Valor numérico (puede incluir decimales)
- **Descripción**: Texto libre (opcional)

### Hoja "Metas" (opcional)

Si deseas también sincronizar tus metas de ahorro, puedes crear una hoja adicional llamada "Metas" con esta estructura:

| Nombre     | Monto Objetivo | Monto Actual | Fecha Objetivo | Color   |
| ---------- | -------------- | ------------ | -------------- | ------- |
| Vacaciones | 5000           | 1500         | 2025-12-31     | #4CAF50 |

## Solución de problemas comunes

### Error al cargar datos: "No se pudo obtener acceso a la hoja de cálculo"

Posibles soluciones:

- Verifica que hayas proporcionado el ID correcto de la hoja de cálculo
- Asegúrate de que la hoja de cálculo sea accesible con tu cuenta de Google
- Comprueba que la API de Google Sheets esté habilitada en tu proyecto de Google Cloud

### Error de autenticación: "Acceso denegado"

Posibles soluciones:

- Asegúrate de haber completado el proceso de autorización OAuth
- Verifica que los ámbitos solicitados incluyan `https://www.googleapis.com/auth/spreadsheets`
- Intenta cerrar sesión y volver a iniciar sesión en Google

### Los datos no se sincronizan correctamente

Posibles soluciones:

- Comprueba la consola del navegador (F12) para ver mensajes de error detallados
- Verifica que la estructura de tu hoja de cálculo coincida con la esperada
- Asegúrate de tener permisos de escritura en la hoja de cálculo

## Notas avanzadas

### Personalizar la integración

Para adaptar la integración según tus necesidades específicas:

1. Modifica `js/api.js` para cambiar la lógica de sincronización
2. Ajusta el mapeo de datos entre la aplicación y Google Sheets en la función `syncTransactionsWithGoogleSheets()`
3. Añade nuevas funciones para sincronizar otros tipos de datos (como metas de ahorro o categorías)

### Modo sin conexión

La aplicación está diseñada para funcionar también sin conexión:

1. Cuando no hay conexión a internet, los datos se almacenan localmente
2. Cuando se restaura la conexión, puedes sincronizar manualmente los datos
3. El modo simulado se activa automáticamente si no se detecta la biblioteca gapi

### Seguridad

Algunas consideraciones importantes:

1. Las credenciales de API están incluidas en el código JavaScript y son visibles para cualquiera que acceda a tu aplicación
2. Para una aplicación de uso personal, esto generalmente no es un problema
3. Para una aplicación pública, considera implementar un backend que maneje la autenticación y las llamadas a la API
