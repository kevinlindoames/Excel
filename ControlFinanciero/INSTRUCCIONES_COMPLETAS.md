# Instrucciones Completas - Control Financiero Personal

Este documento contiene todas las instrucciones necesarias para configurar y utilizar tu aplicación de Control Financiero Personal, desde la configuración del formulario de Google hasta el uso diario.

## Índice

1. [Configuración del Formulario de Google](#1-configuración-del-formulario-de-google)

   - [Estructura del formulario](#estructura-del-formulario)
   - [Creación del formulario](#creación-del-formulario)
   - [Configuración de la sección común](#configuración-de-la-sección-común)
   - [Vinculación a hoja de cálculo](#vinculación-a-hoja-de-cálculo)
   - [Obtención de IDs](#obtención-de-ids)

2. [Configuración de la Aplicación](#2-configuración-de-la-aplicación)

   - [Actualización de IDs](#actualización-de-ids)
   - [Publicación de la aplicación](#publicación-de-la-aplicación)

3. [Uso Diario de la Aplicación](#3-uso-diario-de-la-aplicación)

   - [Inicio y navegación](#inicio-y-navegación)
   - [Registro de transacciones](#registro-de-transacciones)
   - [Sincronización de datos](#sincronización-de-datos)
   - [Visualización de finanzas](#visualización-de-finanzas)
   - [Metas de ahorro](#metas-de-ahorro)
   - [Copias de seguridad](#copias-de-seguridad)

4. [Personalización y Solución de Problemas](#4-personalización-y-solución-de-problemas)
   - [Opciones de personalización](#opciones-de-personalización)
   - [Problemas comunes](#problemas-comunes)

---

# 1. Configuración del Formulario de Google

## Estructura del formulario

Vamos a crear un formulario con la siguiente estructura:

```
Formulario
├── Pregunta: "Tipo de Transacción" (Ingreso/Gasto)
│   ├── Si responde "Ingreso" → Va a Sección "Categorías de Ingreso"
│   └── Si responde "Gasto" → Va a Sección "Categorías de Gasto"
│
├── Sección: "Categorías de Ingreso"
│   ├── Pregunta: "Categoría de Ingreso" (Desplegable con opciones de ingreso)
│   └── Configuración: Al terminar esta sección, ir a "Detalles de la transacción"
│
├── Sección: "Categorías de Gasto"
│   ├── Pregunta: "Categoría de Gasto" (Desplegable con opciones de gasto)
│   └── Configuración: Al terminar esta sección, ir a "Detalles de la transacción"
│
└── Sección: "Detalles de la transacción" (Común para ambos tipos)
    ├── Pregunta: "Monto (S/.)" (Numérico)
    ├── Pregunta: "Fecha" (Fecha)
    ├── Pregunta: "Descripción" (Texto)
    └── Fin del formulario: Botón enviar
```

## Creación del formulario

### Acceder a Google Forms

1. Ve a [Google Forms](https://forms.google.com)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en el botón "+" o en "En blanco" para crear un nuevo formulario

### Configurar la información básica del formulario

1. Haz clic en "Formulario sin título" para cambiarlo por "Control Financiero - Registrar Transacción"
2. En la descripción, puedes escribir: "Utiliza este formulario para registrar tus ingresos y gastos"

### Añadir la primera pregunta (Tipo de Transacción)

1. En la primera pregunta:
   - Título: "Tipo de Transacción"
   - Tipo: Desplegable
   - Opciones: "Ingreso", "Gasto"
   - Marca como "Obligatorio"

### Configurar la lógica condicional

1. Haz clic en los tres puntos verticales (⋮) en la parte inferior derecha de la pregunta
2. Selecciona "Añadir lógica condicional"
3. Añade la primera condición:
   - Si "Tipo de Transacción" es igual a "Ingreso"
   - Ir a la sección "Categorías de Ingreso" (deberás crear esta sección)
4. Añade la segunda condición:
   - Si "Tipo de Transacción" es igual a "Gasto"
   - Ir a la sección "Categorías de Gasto" (deberás crear esta sección)
5. Haz clic en "Listo"

## Configuración de la sección común

### Crear sección "Categorías de Ingreso"

1. Haz clic en el ícono "+" en la barra lateral
2. Selecciona "Añadir sección"
3. Configura el título como "Categorías de Ingreso"
4. (Opcional) Añade una descripción como "Selecciona la categoría que mejor describe este ingreso"
5. Haz clic en "Listo"

### Añadir pregunta de categoría de ingreso

1. Dentro de la sección "Categorías de Ingreso", haz clic en "Añadir pregunta"
2. Configura:
   - Título: "Categoría de Ingreso"
   - Tipo: Desplegable
   - Opciones:
     - Salario
     - Trabajo Freelance
     - Inversiones
     - Regalos/Bonos
     - Otros Ingresos
   - Marca como "Obligatorio"

### Crear sección "Categorías de Gasto"

1. Haz clic en el ícono "+" en la barra lateral
2. Selecciona "Añadir sección"
3. Configura el título como "Categorías de Gasto"
4. (Opcional) Añade una descripción como "Selecciona la categoría que mejor describe este gasto"
5. Haz clic en "Listo"

### Añadir pregunta de categoría de gasto

1. Dentro de la sección "Categorías de Gasto", haz clic en "Añadir pregunta"
2. Configura:
   - Título: "Categoría de Gasto"
   - Tipo: Desplegable
   - Opciones:
     - Vivienda
     - Alimentación
     - Transporte
     - Entretenimiento
     - Salud
     - Educación
     - Servicios
     - Compras
     - Deudas
     - Otros Gastos
   - Marca como "Obligatorio"

### Crear sección común "Detalles de la transacción"

1. Haz clic en el ícono "+" en la barra lateral
2. Selecciona "Añadir sección"
3. Configura el título como "Detalles de la transacción"
4. (Opcional) Añade una descripción como "Proporciona los detalles adicionales de esta transacción"
5. Haz clic en "Listo"

### Configurar el flujo desde secciones anteriores a la sección común

1. Ve a la sección "Categorías de Ingreso"
2. Al final de la sección, haz clic en "Después de la sección"
3. En el menú desplegable, selecciona "Detalles de la transacción"

4. Ve a la sección "Categorías de Gasto"
5. Al final de la sección, haz clic en "Después de la sección"
6. En el menú desplegable, selecciona "Detalles de la transacción"

### Añadir campos comunes en la sección "Detalles de la transacción"

#### Campo "Monto"

1. Dentro de la sección "Detalles de la transacción", haz clic en "Añadir pregunta"
2. Configura:
   - Título: "Monto (S/.)"
   - Tipo: Respuesta corta
   - Validación:
     - Tipo: Número
     - Condición: Mayor que o igual a 0
     - Mensaje de error: "Por favor, ingresa un valor numérico mayor a cero"
   - Marca como "Obligatorio"

#### Campo "Fecha"

1. Haz clic en "Añadir pregunta"
2. Configura:
   - Título: "Fecha"
   - Tipo: Fecha
   - Marca como "Obligatorio"

#### Campo "Descripción"

1. Haz clic en "Añadir pregunta"
2. Configura:
   - Título: "Descripción"
   - Tipo: Respuesta corta
   - Este campo puede ser opcional

### Configurar el final del formulario

1. Al final de la sección "Detalles de la transacción", haz clic en "Después de la sección"
2. Selecciona "Enviar formulario"
3. Puedes personalizar el mensaje de confirmación:
   - Haz clic en el ícono de engranaje (⚙️) en la parte superior del formulario
   - Ve a la pestaña "Presentación"
   - Personaliza el mensaje de confirmación, por ejemplo: "¡Gracias! Tu transacción ha sido registrada correctamente."

## Vinculación a hoja de cálculo

### Crear una hoja de cálculo para las respuestas

1. En tu formulario, haz clic en la pestaña "Respuestas" en la parte superior
2. Haz clic en el icono de hoja de cálculo verde (Crear hoja de cálculo)
3. Selecciona "Crear una nueva hoja de cálculo"
4. Escribe un nombre como "Respuestas - Control Financiero"
5. Haz clic en "Crear"

## Obtención de IDs

### Obtener el ID del formulario

1. Abre tu formulario en modo de edición
2. Mira la URL en tu navegador, debería ser algo como: `https://docs.google.com/forms/d/e/1FAIpQLSeCXZ_bla_bla_identificador_largo/edit`
3. El ID del formulario es la parte entre "/forms/d/e/" y "/edit" (en este ejemplo, sería "1FAIpQLSeCXZ_bla_bla_identificador_largo")
4. Copia este ID

### Obtener el ID de la hoja de cálculo

1. Abre la hoja de cálculo vinculada a tu formulario
2. Mira la URL en tu navegador, debería ser algo como: `https://docs.google.com/spreadsheets/d/1abc123def456_ejemplo_id_largo/edit`
3. El ID de la hoja de cálculo es la parte entre "/spreadsheets/d/" y "/edit" (en este ejemplo, sería "1abc123def456_ejemplo_id_largo")
4. Copia este ID

# 2. Configuración de la Aplicación

## Actualización de IDs

### Actualizar el archivo de configuración

1. Abre el archivo `js/api.js` en un editor de texto
2. Busca la sección `formulariosGoogle`
3. Actualiza los valores con los IDs que obtuviste:

```javascript
formulariosGoogle: {
  transacciones: {
    formId: 'TU-ID-DE-FORMULARIO-AQUÍ',
    url: 'https://docs.google.com/forms/d/e/TU-ID-DE-FORMULARIO-AQUÍ/viewform?embedded=true',
    spreadsheetId: 'TU-ID-DE-HOJA-DE-CÁLCULO-AQUÍ'
  }
}
```

4. Guarda el archivo

## Publicación de la aplicación

Si deseas acceder a la aplicación desde cualquier dispositivo:

- **Opción A - Uso local**: Simplemente abre el archivo `index.html` en tu navegador.
- **Opción B - Publicación en línea**: Sube los archivos a un servicio de hosting web:
  - GitHub Pages (gratuito)
  - Netlify (gratuito)
  - Vercel (gratuito)

# 3. Uso Diario de la Aplicación

## Inicio y navegación

1. Abre el archivo `index.html` en tu navegador
2. La aplicación se cargará mostrando el panel principal con:
   - Tarjetas resumen (ingresos, gastos, ahorros)
   - Gráfico de finanzas
   - Lista de transacciones recientes
   - Gráfico de categorías
   - Sección de metas de ahorro

## Registro de transacciones

### Usando el formulario local

1. Haz clic en el botón "Nueva Transacción" en la sección de transacciones
2. En la ventana modal, selecciona la pestaña "Formulario Rápido"
3. Completa los campos:
   - Tipo de transacción (Ingreso o Gasto)
   - Categoría (cambiará automáticamente según el tipo seleccionado)
   - Monto
   - Fecha
   - Descripción (opcional)
4. Haz clic en "Guardar" para registrar la transacción
5. La transacción aparecerá en la lista de "Transacciones Recientes"

### Usando Google Forms

1. Haz clic en el botón "Nueva Transacción"
2. Selecciona la pestaña "Google Forms"
3. El formulario de Google que has configurado aparecerá integrado
4. Completa los campos siguiendo el flujo del formulario:
   - Selecciona el tipo de transacción
   - Selecciona la categoría correspondiente
   - En la sección "Detalles de la transacción", ingresa monto, fecha y descripción
5. Envía el formulario
6. Los datos se guardarán en tu hoja de cálculo de Google

## Sincronización de datos

Para importar las transacciones registradas a través de Google Forms:

1. En la aplicación, haz clic en el botón "Sincronizar" que aparece en la parte superior del panel principal
2. Confirma la acción
3. La aplicación leerá los datos de tu hoja de cálculo e importará las transacciones

## Visualización de finanzas

- **Panel principal**: Muestra resumen de ingresos, gastos y ahorros
- **Gráfico de líneas**: Visualiza la evolución de tus finanzas
  - Usa los botones de periodo (Semana/Mes/Año) para cambiar la vista
- **Gráfico de categorías**: Muestra desglose de gastos por categoría
- **Lista de transacciones**: Muestra transacciones recientes con filtros

## Metas de ahorro

1. Haz clic en el botón "Nueva Meta" en la sección de metas de ahorro
2. Completa los campos:
   - Nombre de la meta
   - Monto objetivo
   - Fecha límite
   - Color (opcional)
3. Haz clic en "Guardar Meta"
4. La meta aparecerá en la sección de metas con una barra de progreso

## Copias de seguridad

### Exportar datos

1. En el pie de página, haz clic en "Exportar Datos"
2. Se generará un archivo JSON con todos tus datos
3. Guarda este archivo como copia de seguridad

### Copia de seguridad en Google Drive (opcional)

1. Haz clic en "Copia de Seguridad" en el pie de página
2. Inicia sesión con tu cuenta de Google si se te solicita
3. Confirma la acción
4. Tus datos se guardarán en Google Drive

# 4. Personalización y Solución de Problemas

## Opciones de personalización

- **Categorías**: Modifica las categorías en `js/main.js`
- **Estilos y colores**: Ajusta los estilos en `css/styles.css`
- **Logos e íconos**: Reemplaza los archivos en la carpeta `img/`

## Instalación como aplicación móvil (PWA)

- **En Chrome/Android**:

  1. Abre la aplicación en Chrome
  2. Toca el botón de menú (tres puntos)
  3. Selecciona "Añadir a pantalla de inicio"

- **En Safari/iOS**:
  1. Abre la aplicación en Safari
  2. Toca el botón compartir
  3. Selecciona "Añadir a pantalla de inicio"

## Problemas comunes

### No se muestran las transacciones desde Google Forms

- Verifica que los IDs en `js/api.js` sean correctos
- Asegúrate de que la hoja de cálculo tenga los permisos adecuados
- Haz clic en "Sincronizar" para importar manualmente

### Error al cargar el formulario de Google

- Verifica que el ID del formulario sea correcto
- Asegúrate de estar conectado a internet
- Confirma que el formulario esté configurado para ser accesible

### Los gráficos no se actualizan

- Refresca la página después de añadir nuevas transacciones
- Verifica que hayas seleccionado el periodo correcto (Semana/Mes/Año)

### Problemas de sincronización

- La sincronización no es automática, debes hacerla manualmente
- Para una sincronización automática, necesitarías configurar Google Apps Script (avanzado)

## Límites y consideraciones

- Las APIs gratuitas de Google tienen límites de uso (suficientes para uso personal)
- La aplicación guarda datos localmente en tu navegador, pero también en Google Sheets
- Para uso compartido entre dispositivos, necesitarás usar la misma cuenta de Google o configurar permisos compartidos
