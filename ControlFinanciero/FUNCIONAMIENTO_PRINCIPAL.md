# Flujo Principal de Datos: Google Forms → Google Sheets → Aplicación Web

## Funcionamiento Básico

La aplicación funciona principalmente como un visualizador de los datos que ingresas a través de Google Forms:

```
1. INGRESAS DATOS → 2. SE GUARDAN EN SHEETS → 3. LA APLICACIÓN LOS MUESTRA
   (Google Forms)      (Hoja de cálculo)        (Control Financiero)
```

Este es el **flujo principal de trabajo** de la aplicación.

## Paso a Paso del Flujo de Datos

### 1. Ingreso de Datos vía Google Forms

- Abres tu formulario de Google (desde cualquier dispositivo)
- Ingresas tus transacciones (ingresos o gastos)
- Estos datos se guardan automáticamente en tu hoja de Google Sheets

### 2. Almacenamiento en Google Sheets

- Tu hoja de cálculo (ID: 1rf330eHJCMqKxCIt5XStZEuYcgk1TFDX3Bi9Ot31ui4) recibe los datos
- Se organizan en columnas: Fecha, Tipo, Categoría, Monto, Descripción
- La hoja de cálculo actúa como tu base de datos principal

### 3. Visualización en la Aplicación Web

- Abres la aplicación web (index.html o la versión publicada en Netlify)
- La aplicación se conecta a tu hoja de Google Sheets
- Lee los datos que has ingresado vía Google Forms
- Muestra gráficos, resúmenes y análisis basados en esos datos

## Sincronización

Para que la aplicación muestre los datos más recientes de tu hoja de cálculo:

1. Abre la aplicación web
2. Haz clic en el botón "Sincronizar" (ubicado en la parte superior)
3. La aplicación leerá los últimos datos de tu hoja de Google Sheets
4. Los gráficos y resúmenes se actualizarán automáticamente

## Importante

- **La fuente principal de datos es Google Forms/Sheets**: La aplicación está diseñada principalmente para visualizar y analizar los datos que ingresas a través de Google Forms.
- **Los datos no se duplican**: Aunque la aplicación tiene su propio almacenamiento local, su propósito principal es mostrar los datos de Google Sheets.
- **Sincronización manual**: Para ver datos nuevos que hayas ingresado en Google Forms, debes usar el botón "Sincronizar" en la aplicación.

## Alternativa: Ingreso Directo en la Aplicación

Aunque el flujo principal es a través de Google Forms, también puedes ingresar datos directamente en la aplicación:

1. En la aplicación, haz clic en "Nueva Transacción"
2. Usa la pestaña "Formulario Rápido"
3. Ingresa tus datos
4. Estos se guardarán localmente en el navegador

Sin embargo, **estos datos solo estarán disponibles en ese dispositivo** hasta que los sincronices con Google Sheets usando la opción "Exportar".

## Recomendación de Uso

Para aprovechar al máximo la aplicación:

1. **Ingresa datos regularmente** a través de Google Forms
2. **Abre la aplicación web** cuando quieras analizar tus finanzas
3. **Sincroniza los datos** para ver la información más actualizada
4. **Explora los gráficos y resúmenes** para entender mejor tus finanzas

Este enfoque te permite ingresar datos rápidamente desde cualquier dispositivo (incluso sin conexión a internet, ya que Google Forms puede guardar respuestas sin conexión) y luego analizarlos en detalle cuando tengas tiempo.
