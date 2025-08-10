# Limpieza de datos de prueba e integración con Google Forms

## Eliminar datos de prueba

La aplicación viene precargada con datos de prueba para mostrar la funcionalidad. Para eliminarlos:

1. Abre el archivo `js/api.js`
2. Busca la función `readGoogleSheet`
3. Modifica el código para eliminar los datos de prueba:

```javascript
// Busca este código (aproximadamente línea 180):
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

  // Para la demo, devolver datos de ejemplo
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleData = [
        ["Fecha", "Tipo", "Categoría", "Monto", "Descripción"],
        ["2025-08-01", "Ingreso", "Salario", "2500", "Salario mensual"],
        ["2025-08-02", "Gasto", "Vivienda", "800", "Alquiler"],
        ["2025-08-05", "Gasto", "Alimentación", "350", "Supermercado"],
        ["2025-08-10", "Gasto", "Transporte", "120", "Gasolina"],
        ["2025-08-15", "Gasto", "Entretenimiento", "200", "Cine y cena"],
        ["2025-08-20", "Ingreso", "Freelance", "500", "Proyecto freelance"],
      ];
      resolve(sampleData);
    }, 1500);
  });
}
```

4. Reemplázalo con este código que solo devuelve los encabezados:

```javascript
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
```

5. Guarda el archivo

## Cómo funciona la integración con Google Forms y la aplicación

La aplicación está diseñada para permitirte ingresar datos de dos formas:

### 1. Desde la aplicación web directamente

Cuando ingresas datos usando el botón "Nueva Transacción" y seleccionas la pestaña "Formulario Rápido":

1. Los datos se guardan localmente en el almacenamiento del navegador
2. Se muestran inmediatamente en la aplicación
3. NO se envían automáticamente a Google Sheets

### 2. Desde Google Forms

Cuando usas el botón "Nueva Transacción" y seleccionas la pestaña "Google Forms":

1. Se muestra el formulario de Google que has configurado
2. Completas y envías el formulario
3. Los datos se guardan en tu hoja de Google Sheets
4. **No aparecen automáticamente en la aplicación web**

### Sincronización entre Google Sheets y la aplicación

Para que los datos ingresados a través de Google Forms aparezcan en tu aplicación:

1. Debes usar el botón "Sincronizar" en la aplicación
2. Esto hace que la aplicación lea los datos de tu hoja de Google Sheets
3. Los nuevos datos se incorporan a los datos locales

## Flujo completo de datos

```
┌─────────────────┐     ┌───────────────┐     ┌─────────────────┐
│                 │     │               │     │                 │
│  Formulario     │────▶│  Google       │────▶│  Aplicación     │
│  Google Forms   │     │  Sheets       │     │  (Sincronizar)  │
│                 │     │               │     │                 │
└─────────────────┘     └───────────────┘     └─────────────────┘
                                                      ▲
                                                      │
┌─────────────────┐                                   │
│                 │                                   │
│  Formulario     │───────────────────────────────────┘
│  Rápido (Web)   │
│                 │
└─────────────────┘
```

## Modificaciones para evitar datos de prueba

Además del cambio en la función `readGoogleSheet`, también puedes eliminar otros datos de prueba:

1. En el archivo `js/main.js`, busca arrays o objetos que contengan datos de ejemplo
2. Reemplázalos con arrays vacíos o datos mínimos necesarios

3. En el archivo `js/api.js`, busca la función `restoreFromGoogleDriveBackup` y elimina los datos de ejemplo

Estas modificaciones garantizarán que la aplicación comience limpia sin datos precargados, permitiéndote ingresar solo tus propios datos.

## Recomendaciones para la integración

1. **Configuración inicial**: Asegúrate de usar el formulario web primero para configurar algunas categorías
2. **Uso diario desde móvil**: Usa Google Forms para ingresos rápidos cuando estés fuera de casa
3. **Sincronización periódica**: Cuando vuelvas a la aplicación web, usa el botón "Sincronizar"
4. **Copias de seguridad**: Usa la opción "Exportar datos" periódicamente

Este enfoque te permite tener lo mejor de ambos mundos: ingreso rápido de datos desde cualquier dispositivo a través de Google Forms y visualización/análisis detallado en la aplicación web.
