# Lista de Verificación para la Integración con Google Sheets

Utiliza esta lista de verificación para asegurarte de que tu integración con Google Sheets está correctamente configurada y funciona como se espera.

## Configuración Inicial

### Proyecto en Google Cloud

- [ ] He creado un proyecto en Google Cloud Console
- [ ] He habilitado la API de Google Sheets para mi proyecto
- [ ] He configurado la pantalla de consentimiento OAuth
- [ ] He creado una clave de API (API Key)
- [ ] He creado un ID de cliente OAuth

### Hoja de Cálculo

- [ ] He creado una hoja de cálculo en Google Sheets
- [ ] He copiado el ID de la hoja de cálculo desde su URL
- [ ] He renombrado la primera hoja como "Transacciones" (recomendado)
- [ ] He añadido encabezados en la primera fila (opcional pero recomendado):
  - Fecha
  - Tipo
  - Categoría
  - Monto
  - Descripción

### Configuración de la Aplicación

- [ ] He actualizado el archivo `js/api.js` con:
  - Mi clave de API (apiKey)
  - Mi ID de cliente OAuth (clientId)
  - El ID de mi hoja de cálculo (spreadsheetId)
- [ ] He guardado los cambios en el archivo

## Pruebas de Funcionalidad

### Prueba de Conexión Básica

- [ ] He abierto la aplicación en el navegador
- [ ] He hecho clic en "Probar Conexión" en el pie de página
- [ ] He iniciado sesión con mi cuenta de Google cuando se me ha solicitado
- [ ] He autorizado la aplicación para acceder a mis hojas de cálculo
- [ ] He visto un modal mostrando datos de mi hoja de cálculo (o un mensaje indicando que está vacía)
- [ ] He comprobado que no hay errores en la consola del navegador (F12)

### Prueba de Escritura

- [ ] He añadido una nueva transacción usando el formulario de la aplicación
- [ ] He comprobado que la transacción aparece en la aplicación
- [ ] He comprobado que la transacción se ha sincronizado con Google Sheets
  - Para verificar esto, puedo abrir mi hoja de cálculo en Google Sheets y confirmar que los datos están ahí

### Prueba de Lectura

- [ ] He añadido manualmente una nueva fila en mi hoja de cálculo de Google Sheets
- [ ] He hecho clic en "Probar Conexión" en la aplicación
- [ ] He verificado que la aplicación muestra los datos añadidos manualmente en el modal

## Resolución de Problemas

Si alguna de las verificaciones anteriores falla, revisa los siguientes aspectos:

### Problemas de Configuración

- [ ] He confirmado que la API de Google Sheets está habilitada en mi proyecto de Google Cloud
- [ ] He verificado que mi clave de API y ID de cliente son correctos
- [ ] He comprobado que el ID de hoja de cálculo es correcto
- [ ] He confirmado que tengo acceso a la hoja de cálculo con mi cuenta de Google

### Problemas de Conexión

- [ ] He verificado que tengo conexión a Internet
- [ ] He confirmado que no hay bloqueadores o restricciones de red que puedan estar impidiendo la conexión
- [ ] He probado en un navegador diferente para descartar problemas del navegador
- [ ] He borrado la caché y las cookies del navegador

### Problemas de Autorización

- [ ] He verificado que he completado el proceso de autorización OAuth
- [ ] He confirmado que los ámbitos (scopes) solicitados incluyen acceso a Google Sheets
- [ ] He probado cerrar sesión en Google y volver a iniciar sesión
- [ ] He revocado el acceso anterior y autorizado nuevamente la aplicación

## Notas Adicionales

- El modo simulado se activará automáticamente si no hay conexión a Internet o si la biblioteca gapi no está disponible
- Las transacciones siempre se guardan localmente, incluso si hay problemas de conexión con Google Sheets
- Si encuentras errores específicos, consulta la sección "Solución de problemas" en `GUIA_PASO_A_PASO.md`
- Para aplicaciones en producción, considera implementar medidas de seguridad adicionales como se menciona en la documentación

---

**Fecha de verificación:** ******\_\_\_\_******

**Notas personales:**
