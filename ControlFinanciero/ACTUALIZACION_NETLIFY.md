# Cómo Actualizar tu Aplicación en Netlify

Ya que has publicado la aplicación web en Netlify y hemos realizado cambios, necesitas actualizar el sitio para que refleje estos cambios. Aquí te explico cómo hacerlo:

## Método 1: Arrastrar y Soltar (Más Sencillo)

Este método es el más fácil y no requiere conocimientos técnicos:

### Pasos para actualizar tu sitio:

1. **Prepara tus archivos**:

   - Asegúrate de que todos los archivos modificados estén guardados en tu computadora
   - La carpeta `ControlFinanciero` debe contener todos los archivos actualizados

2. **Inicia sesión en Netlify**:

   - Ve a [https://app.netlify.com/](https://app.netlify.com/)
   - Inicia sesión con la cuenta que usaste para publicar el sitio

3. **Accede a tu sitio**:

   - En el dashboard de Netlify, haz clic en el sitio que creaste para la aplicación de Control Financiero
   - Verás un panel con información sobre tu sitio

4. **Actualiza los archivos**:

   - Busca la sección "Deploys" (Despliegues) en el menú de la izquierda
   - Haz clic en ella para ver el historial de despliegues
   - Verás una zona que dice "Drag and drop to deploy" (Arrastra y suelta para desplegar)
   - **Simplemente arrastra la carpeta `ControlFinanciero` completa a esta zona**

5. **Espera a que se complete el despliegue**:

   - Netlify procesará los archivos (esto toma menos de un minuto)
   - Verás una barra de progreso mientras se actualiza
   - Cuando termine, aparecerá un mensaje de "Deploy success!" (¡Despliegue exitoso!)

6. **Verifica tu sitio actualizado**:
   - Haz clic en "Preview" (Vista previa) o en la URL de tu sitio
   - Comprueba que los cambios se hayan aplicado correctamente

## Método 2: A través de la Línea de Comandos (Avanzado)

Si configuraste tu sitio usando Git/GitHub, puedes actualizar el sitio mediante comandos:

```bash
# Suponiendo que tienes un repositorio Git configurado
git add .
git commit -m "Actualización: Eliminación de datos de prueba y otras mejoras"
git push
```

Netlify detectará automáticamente los cambios en el repositorio y actualizará el sitio.

## Cambios Importantes que se Actualizarán

Al actualizar tu sitio, estos son los cambios principales que se aplicarán:

1. **Eliminación de datos de prueba**:

   - La aplicación ya no mostrará datos de ejemplo
   - Comenzará con una hoja limpia para tus propios datos

2. **Documentación adicional**:

   - Se añaden archivos con instrucciones detalladas
   - Esto no afecta la funcionalidad, solo proporciona más información

3. **Mejoras en la integración con Google Sheets**:
   - El flujo de datos entre la aplicación y Google Sheets está mejor documentado

## Solución de Problemas Comunes

### La actualización no muestra los cambios

Si después de actualizar no ves los cambios:

1. **Limpia la caché del navegador**:

   - Presiona Ctrl+F5 (Windows) o Cmd+Shift+R (Mac)
   - O abre el sitio en una ventana de incógnito

2. **Verifica el historial de despliegues**:

   - En Netlify, ve a la sección "Deploys"
   - Asegúrate de que el último despliegue tenga estado "Published" (Publicado)
   - Si muestra errores, haz clic en él para ver los detalles

3. **Comprueba los archivos subidos**:
   - En la sección "Deploys" → último despliegue → "Files"
   - Verifica que los archivos actualizados aparezcan en la lista

### Error durante el despliegue

Si Netlify muestra errores durante el despliegue:

1. **Revisa los mensajes de error**:

   - Haz clic en el despliegue fallido para ver los logs detallados
   - Busca mensajes específicos que indiquen el problema

2. **Problemas comunes**:
   - Archivos muy grandes (más de 100 MB)
   - Caracteres especiales en nombres de archivos
   - Permisos de archivos incorrectos

### Necesitas revertir a una versión anterior

Si quieres volver a una versión anterior:

1. Ve a la sección "Deploys"
2. Encuentra el despliegue anterior que funcionaba correctamente
3. Haz clic en los tres puntos (⋮) junto a ese despliegue
4. Selecciona "Publish deploy" (Publicar despliegue)

## Nota Importante

Netlify mantiene todas las versiones anteriores de tu sitio, así que no te preocupes por perder información. Siempre puedes volver a una versión previa si algo no funciona como esperabas.
