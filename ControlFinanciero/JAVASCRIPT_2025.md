# JavaScript 2025: Características Modernas para tu Aplicación de Control Financiero

Este documento presenta las características más recientes y relevantes de JavaScript (hasta 2025) que pueden aprovecharse en tu aplicación de Control Financiero. Incluye ejemplos prácticos aplicados al contexto financiero.

## Características Esenciales de JavaScript 2025

### 1. Top-level await

Permite usar `await` fuera de funciones asíncronas, simplificando la inicialización de la aplicación.

```javascript
// Inicialización de Firebase
try {
  // Top-level await sin necesidad de una función async
  await window.FIREBASE.init();
  console.log("Firebase inicializado correctamente");

  // Cargar datos iniciales
  const categorias = await window.API.obtenerCategorias();
  const transacciones = await window.API.obtenerTransacciones();

  // Inicializar la interfaz con los datos cargados
  inicializarInterfaz(categorias, transacciones);
} catch (error) {
  mostrarError("Error al inicializar la aplicación", error);
}
```

### 2. Nullish Coalescing (??) y Optional Chaining (?.)

Manejo seguro de valores nulos o indefinidos, ideal para datos financieros que pueden estar incompletos.

```javascript
// Optional chaining
const nombreCategoria = transaccion?.categoria?.nombre ?? "Sin categoría";

// Nullish coalescing para valores por defecto
const montoFormateado = formatCurrency(transaccion?.monto ?? 0);
const descripcion = transaccion?.descripcion ?? "Sin descripción";
```

### 3. Métodos Modernos de Arrays

Nuevos métodos que facilitan el trabajo con colecciones de datos financieros.

#### at()

```javascript
// Obtener la última transacción
const ultimaTransaccion = transacciones.at(-1);

// Obtener la primera transacción
const primeraTransaccion = transacciones.at(0);
```

#### toSorted(), toReversed(), toSpliced()

Métodos no mutables para transformar arrays sin modificar el original.

```javascript
// Ordenar transacciones por fecha sin modificar el array original
const transaccionesOrdenadas = transacciones.toSorted(
  (a, b) => new Date(b.fecha) - new Date(a.fecha)
);

// Filtrar solo gastos y ordenarlos por monto (mayor a menor)
const gastosMayores = transacciones
  .filter((tx) => tx.tipo === "gasto")
  .toSorted((a, b) => b.monto - a.monto);
```

#### findLast() y findLastIndex()

```javascript
// Encontrar el último ingreso registrado
const ultimoIngreso = transacciones.findLast((tx) => tx.tipo === "ingreso");

// Posición del último gasto mayor a 1000
const indiceUltimoGastoGrande = transacciones.findLastIndex(
  (tx) => tx.tipo === "gasto" && tx.monto > 1000
);
```

### 4. Formateo de Números y Fechas Internacional

API de Intl para formateo consistente de monedas y fechas según la ubicación del usuario.

```javascript
// Formatear moneda según la localización
function formatearMoneda(valor, moneda = "PEN") {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: moneda,
  }).format(valor);
}

// Ejemplo: formatearMoneda(1234.56) => "S/ 1,234.56"

// Formatear fechas
function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(fecha);
}

// Ejemplo: formatearFecha("2025-08-11") => "11 de agosto de 2025"
```

### 5. Operador de Fusión Lógica (&&=, ||=, ??=)

```javascript
// Actualizar configuración del usuario manteniendo valores existentes
function actualizarConfiguracion(nuevaConfig) {
  // Solo actualizar si el valor está definido
  config.moneda ??= "PEN";
  config.tema ??= "light";

  // Sobrescribir con nuevos valores si están definidos
  config.moneda = nuevaConfig.moneda ?? config.moneda;
  config.tema = nuevaConfig.tema ?? config.tema;
}
```

### 6. Records y Tuples (Stage 3)

Estructuras de datos inmutables para operaciones financieras que requieren integridad.

```javascript
// Record para configuración inmutable
const defaultConfig = #{
  moneda: "PEN",
  tema: "light",
  decimales: 2,
};

// Tuple para representar una transacción de forma inmutable
const transaccion = #[
  "2025-08-11", // fecha
  "gasto", // tipo
  "cat001", // categoriaId
  250.0, // monto
  "Compra de supermercado", // descripción
];
```

### 7. Pattern Matching (Stage 2)

Simplifica la lógica condicional compleja, útil para procesar diferentes tipos de transacciones.

```javascript
function procesarTransaccion(transaccion) {
  return match (transaccion) {
    when ({ tipo: "ingreso", monto: > 5000 }) =>
      registrarIngresoGrande(transaccion),
    when ({ tipo: "gasto", categoria: "salud" }) =>
      calcularDeduccionImpuestos(transaccion),
    when ({ tipo: "ahorro" }) =>
      actualizarMetasAhorro(transaccion),
    default =>
      registrarTransaccionNormal(transaccion)
  };
}
```

### 8. Decoradores (Stage 3)

Útiles para aspectos transversales como logging, validación o control de acceso.

```javascript
// Decorador para medir tiempo de ejecución
function medir(target, name, descriptor) {
  const metodoOriginal = descriptor.value;
  descriptor.value = function (...args) {
    const inicio = performance.now();
    const resultado = metodoOriginal.apply(this, args);
    const fin = performance.now();
    console.log(`${name} tomó ${fin - inicio}ms en ejecutarse`);
    return resultado;
  };
  return descriptor;
}

class AnalisisFinanciero {
  @medir
  calcularEstadisticas(transacciones) {
    // Cálculos complejos...
    return estadisticas;
  }
}
```

### 9. Import Assertions

Importar directamente JSON y otros tipos de recursos.

```javascript
// Importar configuración desde JSON
import configData from "./config.json" assert { type: "json" };

// Importar datos de categorías predefinidas
import categoriasPredefinidas from "./categorias.json" assert { type: "json" };
```

### 10. Temporal API

API moderna para manejo de fechas, tiempos y zonas horarias, crucial para aplicaciones financieras.

```javascript
// Calcular diferencia entre fechas
const fechaInicio = Temporal.PlainDate.from("2025-01-01");
const fechaFin = Temporal.PlainDate.from("2025-12-31");
const duracion = fechaInicio.until(fechaFin);

console.log(`El periodo fiscal es de ${duracion.days} días`);

// Sumar meses a una fecha
const fechaActual = Temporal.Now.plainDateISO();
const tresMesesDespues = fechaActual.add({ months: 3 });

console.log(`Fecha de vencimiento: ${tresMesesDespues.toString()}`);
```

## Patrones Modernos para Aplicaciones Financieras

### 1. Arquitectura de Módulos con Import Dinámico

```javascript
// Cargar módulos según la sección activa
async function cargarModulo(seccion) {
  try {
    const modulo = await import(`./modulos/${seccion}.js`);
    modulo.inicializar();
  } catch (error) {
    console.error(`Error al cargar el módulo ${seccion}:`, error);
  }
}

// Uso
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const seccion = e.target.dataset.page;
    cargarModulo(seccion);
  });
});
```

### 2. Manejo de Estado con Proxies

```javascript
// Estado reactivo para la aplicación
const createStore = (initialState) => {
  const state = new Proxy(
    { ...initialState },
    {
      set(target, property, value) {
        const oldValue = target[property];
        target[property] = value;

        // Notificar cambios
        if (oldValue !== value) {
          notifyChange(property, value, oldValue);
        }
        return true;
      },
    }
  );

  return state;
};

// Uso
const appState = createStore({
  transacciones: [],
  categorias: [],
  saldoActual: 0,
  filtrosActivos: {},
});

// Al cambiar el estado, la UI se actualiza automáticamente
appState.saldoActual = 1500.75;
```

### 3. Patrones de Programación Funcional

```javascript
// Procesamiento de transacciones con programación funcional
const calcularEstadisticas = (transacciones) => {
  const porTipo = transacciones.reduce((acc, tx) => {
    acc[tx.tipo] = (acc[tx.tipo] || 0) + tx.monto;
    return acc;
  }, {});

  const totalIngresos = porTipo.ingreso || 0;
  const totalGastos = porTipo.gasto || 0;
  const balance = totalIngresos - totalGastos;

  return {
    ingresos: totalIngresos,
    gastos: totalGastos,
    balance,
    ahorros: porTipo.ahorro || 0,
    porcentajeAhorro:
      totalIngresos > 0 ? ((porTipo.ahorro || 0) / totalIngresos) * 100 : 0,
  };
};
```

### 4. Web Workers para Cálculos Intensivos

Mover cálculos financieros complejos a un hilo separado para no bloquear la interfaz.

```javascript
// En el archivo principal
const worker = new Worker("js/calculosFinancieros.js");

worker.postMessage({
  action: "calcularEstadisticas",
  data: transaccionesList,
});

worker.onmessage = (e) => {
  const { resultados } = e.data;
  actualizarDashboard(resultados);
};

// En calculosFinancieros.js
self.onmessage = (e) => {
  const { action, data } = e.data;

  if (action === "calcularEstadisticas") {
    // Realizar cálculos intensivos
    const resultados = procesarTransacciones(data);
    self.postMessage({ resultados });
  }
};
```

### 5. Caché Inteligente con IndexedDB

```javascript
// Caché local para mejorar rendimiento
const dbPromise = idb.openDB("control-financiero", 1, {
  upgrade(db) {
    db.createObjectStore("transacciones", { keyPath: "id" });
    db.createObjectStore("categorias", { keyPath: "id" });
  },
});

// Guardar datos localmente
async function guardarTransaccionesLocales(transacciones) {
  const db = await dbPromise;
  const tx = db.transaction("transacciones", "readwrite");

  for (const transaccion of transacciones) {
    tx.store.put(transaccion);
  }

  await tx.done;
}

// Recuperar datos localmente cuando no hay conexión
async function obtenerTransaccionesLocales() {
  try {
    const db = await dbPromise;
    return db.getAll("transacciones");
  } catch (error) {
    console.error("Error al obtener datos locales:", error);
    return [];
  }
}
```

## Optimización de Rendimiento

### 1. Web Vitals y Medidas de Rendimiento

```javascript
// Medir métricas de rendimiento
const reportWebVitals = () => {
  const vitals = {};

  new PerformanceObserver((entries) => {
    entries.getEntries().forEach((entry) => {
      vitals[entry.name] = entry.value;
    });
    console.log("Web Vitals:", vitals);
  }).observe({ type: "web-vitals", buffered: true });
};

// Medir tiempo de carga inicial
window.addEventListener("load", () => {
  setTimeout(() => {
    const timing = performance.getEntriesByType("navigation")[0];
    console.log(`Tiempo de carga: ${timing.loadEventEnd}ms`);
  }, 0);
});
```

### 2. Uso de Intersection Observer para Carga Diferida

```javascript
// Cargar gráficos solo cuando sean visibles
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const chartId = entry.target.id;
        cargarGrafico(chartId);
        // Dejar de observar después de cargar
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Observar todos los contenedores de gráficos
document.querySelectorAll(".chart-container").forEach((chart) => {
  observer.observe(chart);
});
```

### 3. Virtualización de Listas Largas

```javascript
// Crear lista virtual para transacciones
function crearListaVirtual(contenedor, items, alturaItem) {
  const total = items.length;
  const visible = Math.ceil(contenedor.clientHeight / alturaItem);
  let startIndex = 0;

  // Configurar tamaño del contenedor
  const placeholder = document.createElement("div");
  placeholder.style.height = `${total * alturaItem}px`;
  contenedor.appendChild(placeholder);

  function renderizarItems() {
    // Limpiar contenido actual
    contenedor.innerHTML = "";
    contenedor.appendChild(placeholder);

    // Renderizar solo elementos visibles
    for (
      let i = startIndex;
      i < Math.min(total, startIndex + visible + 5);
      i++
    ) {
      const item = crearElementoTransaccion(items[i]);
      item.style.position = "absolute";
      item.style.top = `${i * alturaItem}px`;
      contenedor.appendChild(item);
    }
  }

  // Manejar scroll
  contenedor.addEventListener("scroll", () => {
    const nuevoIndex = Math.floor(contenedor.scrollTop / alturaItem);
    if (nuevoIndex !== startIndex) {
      startIndex = nuevoIndex;
      renderizarItems();
    }
  });

  // Renderizado inicial
  renderizarItems();
}
```

## Seguridad en JavaScript

### 1. Content Security Policy (CSP)

```html
<!-- En el encabezado HTML -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' https://www.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;"
/>
```

### 2. Sanitización de Datos de Entrada

```javascript
// Sanitizar entradas de usuario
function sanitizarEntrada(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Validar y sanitizar datos de formulario
function validarFormularioTransaccion(datos) {
  const resultado = {
    valido: true,
    errores: [],
    datosSanitizados: {},
  };

  // Validar tipo
  if (!["ingreso", "gasto", "ahorro"].includes(datos.tipo)) {
    resultado.valido = false;
    resultado.errores.push("Tipo de transacción inválido");
  }

  // Validar monto
  const monto = parseFloat(datos.monto);
  if (isNaN(monto) || monto <= 0) {
    resultado.valido = false;
    resultado.errores.push("El monto debe ser un número positivo");
  }

  // Sanitizar descripción
  resultado.datosSanitizados.descripcion = sanitizarEntrada(
    datos.descripcion || ""
  );

  // Añadir el resto de campos validados
  if (resultado.valido) {
    resultado.datosSanitizados = {
      ...resultado.datosSanitizados,
      fecha: datos.fecha,
      tipo: datos.tipo,
      monto: monto,
      categoria: datos.categoria,
    };
  }

  return resultado;
}
```

### 3. Almacenamiento Seguro de Datos Sensibles

```javascript
// Almacenamiento seguro de preferencias del usuario
class SecureStorage {
  constructor(namespace = "app") {
    this.namespace = namespace;
    this.storage = window.localStorage;
  }

  // Guardar dato encriptado
  setItem(key, value) {
    const fullKey = `${this.namespace}:${key}`;
    const valueString = JSON.stringify(value);

    // En una implementación real, usaríamos encriptación
    // Aquí simplemente codificamos en base64 como ejemplo
    const encoded = btoa(encodeURIComponent(valueString));
    this.storage.setItem(fullKey, encoded);
  }

  // Recuperar y desencriptar dato
  getItem(key) {
    const fullKey = `${this.namespace}:${key}`;
    const encoded = this.storage.getItem(fullKey);

    if (!encoded) return null;

    try {
      // Descodificar (en una implementación real, desencriptaríamos)
      const valueString = decodeURIComponent(atob(encoded));
      return JSON.parse(valueString);
    } catch (e) {
      console.error("Error al recuperar dato:", e);
      return null;
    }
  }

  // Eliminar dato
  removeItem(key) {
    const fullKey = `${this.namespace}:${key}`;
    this.storage.removeItem(fullKey);
  }
}

// Uso
const secureStorage = new SecureStorage("controlFinanciero");
secureStorage.setItem("configuracion", { tema: "dark", moneda: "PEN" });
```

## Recursos para Seguir Aprendiendo

1. [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/JavaScript) - Documentación oficial y actualizada
2. [TC39 Proposals](https://github.com/tc39/proposals) - Propuestas oficiales para ECMAScript
3. [JavaScript Weekly](https://javascriptweekly.com/) - Boletín semanal con noticias
4. [V8 Blog](https://v8.dev/blog) - Blog del motor V8 con actualizaciones
5. [Cursos en YouTube](https://youtube.com/results?search_query=javascript+2025+tutorial)

---

Este documento se actualizará periódicamente para incluir las nuevas características y mejores prácticas de JavaScript a medida que se adoptan en la industria.
