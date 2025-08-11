# Guía para Crear la Hoja de Cálculo de Control Financiero

Este documento explica cómo configurar correctamente tu hoja de cálculo en Google Sheets para que funcione con la aplicación de Control Financiero.

## 1. Crear una nueva hoja de cálculo en Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com/)
2. Haz clic en "Archivo en blanco" para crear una nueva hoja de cálculo
3. Cambia el nombre de la hoja de cálculo a "Control Financiero" (o cualquier otro nombre que prefieras)

## 2. Configurar la hoja "Transacciones"

Esta es la hoja principal donde se registrarán todos tus ingresos y gastos.

1. Renombra la primera hoja como "Transacciones"
2. Configura los encabezados en la primera fila:
   - A1: Fecha
   - B1: Tipo
   - C1: Categoría
   - D1: Monto
   - E1: Descripción
3. Aplica formato de encabezado a la primera fila:
   - Selecciona la fila 1
   - Elige un color de fondo (por ejemplo, gris claro)
   - Aplica negrita al texto
   - Centra el texto

![Ejemplo de hoja Transacciones](https://i.imgur.com/ejemplo-transacciones.png)

## 3. Crear la hoja "Categorías" (opcional)

Esta hoja te permitirá mantener un registro de las categorías para ingresos y gastos.

1. Haz clic en el "+" en la parte inferior para crear una nueva hoja
2. Renombra la hoja como "Categorías"
3. Configura los encabezados en la primera fila:
   - A1: ID
   - B1: Nombre
   - C1: Tipo
   - D1: Color
4. Aplica formato de encabezado como hiciste con la hoja Transacciones
5. Añade algunas categorías iniciales, por ejemplo:

| ID     | Nombre              | Tipo    | Color   |
| ------ | ------------------- | ------- | ------- |
| cat001 | Salario             | Ingreso | #4CAF50 |
| cat002 | Freelance           | Ingreso | #8BC34A |
| cat003 | Alimentación        | Gasto   | #F44336 |
| cat004 | Transporte          | Gasto   | #FF9800 |
| cat005 | Entretenimiento     | Gasto   | #9C27B0 |
| cat006 | Servicios           | Gasto   | #2196F3 |
| cat007 | Salud               | Gasto   | #E91E63 |
| cat008 | Fondo de emergencia | Ahorro  | #607D8B |

## 4. Crear la hoja "Metas" (opcional)

Esta hoja te permitirá hacer seguimiento a tus metas de ahorro.

1. Crea una nueva hoja y renómbrala como "Metas"
2. Configura los encabezados en la primera fila:
   - A1: Nombre
   - B1: Monto Objetivo
   - C1: Monto Actual
   - D1: Fecha Objetivo
   - E1: Color
3. Aplica formato de encabezado como en las hojas anteriores
4. Añade algunas metas iniciales, por ejemplo:

| Nombre         | Monto Objetivo | Monto Actual | Fecha Objetivo | Color   |
| -------------- | -------------- | ------------ | -------------- | ------- |
| Vacaciones     | 5000           | 1500         | 2025-12-31     | #4CAF50 |
| Nuevo teléfono | 1000           | 450          | 2025-09-30     | #2196F3 |
| Emergencias    | 10000          | 3500         | 2026-06-30     | #FF9800 |

## 5. Configurar permisos de acceso

Para que la aplicación pueda acceder a tu hoja de cálculo, debes configurar los permisos correctamente:

1. Haz clic en el botón "Compartir" en la esquina superior derecha
2. Asegúrate de que tu cuenta de Google tenga acceso de edición
3. Si necesitas compartir la hoja con otras personas:
   - Añade sus correos electrónicos
   - Selecciona el nivel de acceso (Lector o Editor)

## 6. Obtener el ID de la hoja de cálculo

El ID es necesario para configurar la aplicación:

1. Observa la URL de tu hoja de cálculo, tendrá este formato:
   ```
   https://docs.google.com/spreadsheets/d/TU_ID_DE_HOJA_DE_CALCULO/edit
   ```
2. El ID es la parte intermedia entre `/d/` y `/edit`
3. Para tu hoja, el ID es:
   ```
   1iFLN6CvJ5gsi_npP9niMssKVcACmTbFVji9RjZHwWQs
   ```
4. Copia este ID y úsalo en la configuración de la aplicación

## 7. Consejos para mantener la hoja de cálculo

- **No elimines los encabezados**: La aplicación espera que la primera fila contenga los encabezados.
- **Respeta el formato de fechas**: Usa el formato YYYY-MM-DD para las fechas.
- **Tipos de transacciones**: Usa "Ingreso", "Gasto" o "Ahorro" en la columna Tipo.
- **Evita cambiar el nombre de las hojas**: Si necesitas cambiar los nombres, actualiza también la configuración en la aplicación.

## 8. Solución de problemas

Si encuentras problemas con la sincronización:

1. Verifica que la hoja de cálculo esté accesible desde tu cuenta
2. Comprueba que los nombres de las hojas coincidan exactamente con los configurados
3. Asegúrate de que no hayas modificado la estructura de las columnas
4. Revisa los permisos de la aplicación en Google Cloud Console
5. Prueba a generar un nuevo ID de cliente si las credenciales han expirado

Con estos pasos, tu hoja de cálculo estará lista para funcionar con la aplicación de Control Financiero.
