# Control Financiero Personal

Aplicación web que te permite gestionar tus finanzas personales con un enfoque mobile-first, integración con Google Forms y visualización de datos mediante gráficos interactivos.

## Características principales

- 📱 **Diseño responsive Mobile-First**: Optimizado para dispositivos móviles
- 📊 **Visualización de datos**: Gráficos de ingresos, gastos y ahorros
- 📝 **Registro de transacciones**: Formulario integrado y conexión con Google Forms
- 🗂️ **Categorización**: Organización de transacciones por categorías
- 🎯 **Metas de ahorro**: Seguimiento de objetivos financieros
- 🌓 **Modo oscuro**: Interfaz adaptable para uso diurno y nocturno
- 📵 **Funcionamiento offline**: Almacenamiento local de datos
- 📱 **PWA**: Instalable como aplicación en dispositivos móviles

## Estructura del proyecto

```
ControlFinanciero/
│
├── index.html                # Página principal
├── manifest.json             # Configuración de PWA
├── service-worker.js         # Soporte offline
├── instrucciones_configuracion.md  # Guía para Google Forms
│
├── css/
│   └── styles.css            # Estilos con enfoque mobile-first
│
├── js/
│   ├── main.js               # Lógica principal
│   ├── charts.js             # Gráficos con Chart.js
│   └── api.js                # Conexión con Google Sheets
│
└── img/                      # Carpeta para imágenes e íconos
```

## Guía rápida de uso

1. **Instalación**

   - No requiere instalación, abre `index.html` en tu navegador
   - Opcionalmente, configura un servidor web para acceder remotamente

2. **Configuración de Google Forms**

   - Sigue las instrucciones detalladas en `instrucciones_configuracion.md`
   - Crea un formulario en Google Forms con los campos necesarios
   - Conecta el formulario a una hoja de cálculo
   - Configura los IDs en el archivo `js/api.js`

3. **Uso de la aplicación**
   - **Registrar transacciones**: Usa el botón "Nueva Transacción"
   - **Establecer metas**: Crea objetivos de ahorro con "Nueva Meta"
   - **Analizar datos**: Visualiza tus finanzas en los gráficos
   - **Exportar datos**: Usa los botones en el pie de página

## Funcionamiento del sistema de categorías

La aplicación maneja dos tipos de formularios para ingresar transacciones:

### Formulario local (dentro de la aplicación)

En el formulario integrado de la aplicación, cuando seleccionas el tipo de transacción (Ingreso o Gasto), el selector de categorías se actualiza automáticamente para mostrar solo las categorías relevantes:

- **Para Ingresos**: Salario, Trabajo Freelance, Inversiones, Regalos/Bonos, Otros Ingresos
- **Para Gastos**: Vivienda, Alimentación, Transporte, Entretenimiento, Salud, Educación, Servicios, Compras, Deudas, Otros Gastos

### Formulario de Google (opcional)

Para el formulario de Google, tienes dos opciones de configuración (detalladas en `instrucciones_configuracion.md`):

1. **Opción A (Básica)**: Una lista única de categorías
2. **Opción B (Avanzada)**: Lógica condicional que muestra diferentes categorías según la selección del usuario

Independientemente de qué opción elijas, la aplicación reconocerá automáticamente qué categorías corresponden a ingresos y cuáles a gastos cuando procese los datos.

## Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño mobile-first con variables CSS
- **JavaScript**: Funcionalidad dinámica
- **Chart.js**: Visualización de datos
- **Google Forms/Sheets**: Almacenamiento en la nube
- **PWA**: Funcionalidades de aplicación progresiva

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Google (para la integración con Google Forms/Sheets)
- Conexión a internet (para sincronización, aunque funciona offline)

## Privacidad y seguridad

- Los datos se almacenan localmente en tu dispositivo
- La integración con Google utiliza tu propia cuenta de Google
- No se comparten datos con terceros

## Personalización

- Puedes modificar las categorías en el archivo `js/main.js`
- Los colores y estilos se pueden ajustar en `css/styles.css`
- Configura tus propios formularios siguiendo las instrucciones
