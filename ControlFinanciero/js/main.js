// Controlador principal de la aplicación
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar la aplicación
  initApp();
});

// Configuración y variables globales
const CONFIG = {
  currency: "S/.",
  dateFormat: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  categorias: {
    ingresos: [
      { id: "salario", nombre: "Salario", color: "#4CAF50" },
      { id: "freelance", nombre: "Trabajo Freelance", color: "#8BC34A" },
      { id: "inversiones", nombre: "Inversiones", color: "#CDDC39" },
      { id: "regalos", nombre: "Regalos/Bonos", color: "#FFEB3B" },
      { id: "otros_ingresos", nombre: "Otros Ingresos", color: "#FFC107" },
    ],
    gastos: [
      { id: "vivienda", nombre: "Vivienda", color: "#F44336" },
      { id: "alimentacion", nombre: "Alimentación", color: "#E91E63" },
      { id: "transporte", nombre: "Transporte", color: "#9C27B0" },
      { id: "entretenimiento", nombre: "Entretenimiento", color: "#673AB7" },
      { id: "salud", nombre: "Salud", color: "#3F51B5" },
      { id: "educacion", nombre: "Educación", color: "#2196F3" },
      { id: "servicios", nombre: "Servicios", color: "#03A9F4" },
      { id: "compras", nombre: "Compras", color: "#00BCD4" },
      { id: "deudas", nombre: "Deudas", color: "#009688" },
      { id: "otros_gastos", nombre: "Otros Gastos", color: "#FF9800" },
    ],
  },
  periodos: {
    week: 7,
    month: 30,
    year: 365,
  },
  formulariosGoogle: {
    transacciones: {
      formId: "", // Aquí irá el ID de tu formulario Google
      url: "", // URL del formulario incrustable
      spreadsheetId: "", // ID de la hoja de cálculo vinculada
    },
  },
};

// Estado de la aplicación
let APP_STATE = {
  theme: "light",
  period: "month",
  transacciones: [],
  metas: [],
  formularioGoogle: null,
  datosActualizados: null,
};

// Inicializar la aplicación
function initApp() {
  // Comprobar si hay temas guardados
  checkSavedTheme();

  // Cargar datos almacenados localmente
  loadLocalData();

  // Inicializar eventos
  setupEventListeners();

  // Cargar datos desde Google Sheets (si está configurado)
  syncWithGoogleSheets();

  // Actualizar la interfaz
  updateUI();
}

// Comprobar si hay un tema guardado y aplicarlo
function checkSavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    APP_STATE.theme = savedTheme;
    applyTheme(savedTheme);
  }
}

// Aplicar el tema seleccionado
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("theme-toggle").checked = true;
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.getElementById("theme-toggle").checked = false;
  }
  APP_STATE.theme = theme;
  localStorage.setItem("theme", theme);
}

// Configurar los escuchadores de eventos
function setupEventListeners() {
  // Cambio de tema
  document
    .getElementById("theme-toggle")
    .addEventListener("change", function () {
      const newTheme = this.checked ? "dark" : "light";
      applyTheme(newTheme);
    });

  // Selector de periodo
  const periodButtons = document.querySelectorAll(".period-selector button");
  periodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      periodButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      APP_STATE.period = this.dataset.period;
      updateCharts();
    });
  });

  // Botón de nueva transacción
  document
    .getElementById("add-transaction")
    .addEventListener("click", function () {
      openModal("transaction-modal");
    });

  // Botón de nueva meta
  document.getElementById("add-goal").addEventListener("click", function () {
    openModal("goal-modal");
  });

  // Cerrar modales
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      closeModal(modal.id);
    });
  });

  // Cambiar entre tabs
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      const tabContainer = this.closest(".tabs").parentElement;

      // Desactivar todos los tabs y contenidos
      tabContainer.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      tabContainer.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      // Activar el tab seleccionado
      this.classList.add("active");
      tabContainer.querySelector(`#${tabId}`).classList.add("active");

      // Si es el tab de Google Form, cargar el iframe
      if (tabId === "google-form") {
        loadGoogleForm();
      }
    });
  });

  // Formulario de nueva transacción
  document
    .getElementById("transaction-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      saveTransaction();
    });

  // Formulario de nueva meta
  document.getElementById("goal-form").addEventListener("submit", function (e) {
    e.preventDefault();
    saveGoal();
  });

  // Exportar datos
  document.getElementById("export-data").addEventListener("click", exportData);

  // Copia de seguridad
  document.getElementById("backup-data").addEventListener("click", backupData);

  // Inicializar categorías en el formulario
  initCategoriesSelect();

  // Establecer la fecha actual como valor predeterminado
  document.getElementById("transaction-date").valueAsDate = new Date();
}

// Inicializar el selector de categorías
function initCategoriesSelect() {
  const selectElement = document.getElementById("transaction-category");
  const transactionType = document.getElementById("transaction-type");

  // Función para actualizar las categorías según el tipo
  function updateCategories() {
    // Limpiar opciones actuales
    selectElement.innerHTML = '<option value="">Seleccionar categoría</option>';

    // Obtener categorías según el tipo seleccionado
    const categorias =
      transactionType.value === "income"
        ? CONFIG.categorias.ingresos
        : CONFIG.categorias.gastos;

    // Añadir opciones
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      selectElement.appendChild(option);
    });
  }

  // Actualizar categorías al cambiar el tipo
  transactionType.addEventListener("change", updateCategories);

  // Inicializar categorías
  updateCategories();
}

// Cargar datos locales desde localStorage
function loadLocalData() {
  try {
    // Cargar transacciones
    const savedTransactions = localStorage.getItem("transacciones");
    if (savedTransactions) {
      APP_STATE.transacciones = JSON.parse(savedTransactions);
    }

    // Cargar metas
    const savedGoals = localStorage.getItem("metas");
    if (savedGoals) {
      APP_STATE.metas = JSON.parse(savedGoals);
    }

    // Cargar última sincronización
    const lastSync = localStorage.getItem("lastSync");
    if (lastSync) {
      APP_STATE.datosActualizados = new Date(lastSync);
    }
  } catch (error) {
    console.error("Error al cargar datos locales:", error);
  }
}

// Guardar datos localmente
function saveLocalData() {
  try {
    localStorage.setItem(
      "transacciones",
      JSON.stringify(APP_STATE.transacciones)
    );
    localStorage.setItem("metas", JSON.stringify(APP_STATE.metas));
    localStorage.setItem("lastSync", new Date().toISOString());
  } catch (error) {
    console.error("Error al guardar datos locales:", error);
    alert(
      "Hubo un error al guardar los datos. Es posible que el almacenamiento local esté lleno."
    );
  }
}

// Esta función anteriormente cargaba datos de ejemplo, pero ha sido eliminada
// para evitar que la aplicación muestre datos ficticios

// Sincronizar con Google Sheets
function syncWithGoogleSheets() {
  // Comprobar si se ha configurado la conexión con Google Sheets
  if (!CONFIG.formulariosGoogle.transacciones.spreadsheetId) {
    console.log("No se ha configurado la conexión con Google Sheets");
    return;
  }

  // Aquí iría el código para sincronizar con Google Sheets mediante la API
  // En una implementación real, esto se haría a través de Google Apps Script
  // que actuaría como intermediario entre nuestra aplicación y Google Sheets

  console.log("Sincronizando con Google Sheets...");

  // Simulamos una actualización para la demostración
  setTimeout(() => {
    APP_STATE.datosActualizados = new Date();
    updateUI();
  }, 1500);
}

// Cargar formulario de Google en el iframe
function loadGoogleForm() {
  const iframe = document.getElementById("google-form-iframe");

  // Comprobar si se ha configurado el formulario
  if (CONFIG.formulariosGoogle.transacciones.url) {
    iframe.src = CONFIG.formulariosGoogle.transacciones.url;
  } else {
    // Mostrar mensaje si no hay formulario configurado
    iframe.insertAdjacentHTML(
      "afterend",
      `
            <div class="empty-state">
                <p>No hay un formulario de Google configurado.</p>
                <p>Para conectar tu formulario, agrega su URL en la configuración de la aplicación.</p>
                <p>Crea un formulario en <a href="https://forms.google.com" target="_blank">Google Forms</a> con los siguientes campos:</p>
                <ul>
                    <li>Tipo de transacción (Ingreso/Gasto)</li>
                    <li>Categoría</li>
                    <li>Monto</li>
                    <li>Fecha</li>
                    <li>Descripción</li>
                </ul>
            </div>
        `
    );
  }
}

// Guardar una nueva transacción
function saveTransaction() {
  // Obtener valores del formulario
  const tipo = document.getElementById("transaction-type").value;
  const categoria = document.getElementById("transaction-category").value;
  const monto = parseFloat(document.getElementById("transaction-amount").value);
  const fecha = document.getElementById("transaction-date").value;
  const descripcion = document.getElementById("transaction-description").value;

  // Validar campos requeridos
  if (!categoria || !monto || !fecha) {
    alert("Por favor, completa todos los campos requeridos");
    return;
  }

  // Crear nueva transacción
  const nuevaTransaccion = {
    id: "tx_" + Date.now(),
    tipo,
    categoria,
    monto,
    fecha,
    descripcion,
  };

  // Añadir a las transacciones existentes
  APP_STATE.transacciones.push(nuevaTransaccion);

  // Guardar datos
  saveLocalData();

  // Actualizar UI
  updateUI();

  // Cerrar modal
  closeModal("transaction-modal");

  // Limpiar formulario
  document.getElementById("transaction-form").reset();
  document.getElementById("transaction-date").valueAsDate = new Date();
  initCategoriesSelect();
}

// Guardar una nueva meta
function saveGoal() {
  // Obtener valores del formulario
  const nombre = document.getElementById("goal-name").value;
  const monto = parseFloat(document.getElementById("goal-amount").value);
  const fecha = document.getElementById("goal-date").value;
  const color = document.getElementById("goal-color").value;

  // Validar campos requeridos
  if (!nombre || !monto || !fecha) {
    alert("Por favor, completa todos los campos requeridos");
    return;
  }

  // Crear nueva meta
  const nuevaMeta = {
    id: "meta_" + Date.now(),
    nombre,
    monto,
    actual: 0,
    fecha,
    color,
  };

  // Añadir a las metas existentes
  APP_STATE.metas.push(nuevaMeta);

  // Guardar datos
  saveLocalData();

  // Actualizar UI
  updateUI();

  // Cerrar modal
  closeModal("goal-modal");

  // Limpiar formulario
  document.getElementById("goal-form").reset();
  document.getElementById("goal-color").value = "#4CAF50";
}

// Exportar datos
function exportData() {
  // Crear objeto con todos los datos
  const dataToExport = {
    transacciones: APP_STATE.transacciones,
    metas: APP_STATE.metas,
    configuracion: CONFIG,
    fechaExportacion: new Date().toISOString(),
  };

  // Convertir a JSON
  const jsonData = JSON.stringify(dataToExport, null, 2);

  // Crear blob y enlace de descarga
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Crear enlace temporal y descargar
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "control_financiero_export_" +
    new Date().toISOString().slice(0, 10) +
    ".json";
  document.body.appendChild(a);
  a.click();

  // Limpiar
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// Copia de seguridad
function backupData() {
  // En una implementación real, esto podría guardar en Google Drive
  // Para esta demo, mostraremos un mensaje
  alert(
    "Copia de seguridad creada con éxito. En una implementación completa, esto se guardaría en Google Drive u otro servicio en la nube."
  );

  // Simular actualización
  APP_STATE.datosActualizados = new Date();
  updateUI();
}

// Abrir modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("active");

  // Si es el modal de transacción, reiniciar formulario
  if (modalId === "transaction-modal") {
    document.getElementById("transaction-form").reset();
    document.getElementById("transaction-date").valueAsDate = new Date();
    initCategoriesSelect();
  }

  // Si es el modal de meta, reiniciar formulario
  if (modalId === "goal-modal") {
    document.getElementById("goal-form").reset();
    document.getElementById("goal-color").value = "#4CAF50";
  }
}

// Cerrar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("active");
}

// Actualizar toda la interfaz de usuario
function updateUI() {
  updateSummary();
  updateTransactionsList();
  updateCategoriesChart();
  updateGoalsList();
  updateCharts();
}

// Actualizar resumen financiero
function updateSummary() {
  // Calcular totales
  const totales = calcularTotales();

  // Actualizar montos en la UI
  document.getElementById("total-income").textContent =
    CONFIG.currency + " " + totales.ingresos.toFixed(2);
  document.getElementById("total-expenses").textContent =
    CONFIG.currency + " " + totales.gastos.toFixed(2);
  document.getElementById("total-savings").textContent =
    CONFIG.currency + " " + totales.ahorros.toFixed(2);

  // Cambios porcentuales (mock para la demo)
  document.getElementById("income-change").innerHTML =
    '<i class="fas fa-arrow-up"></i> 5%';
  document.getElementById("expenses-change").innerHTML =
    '<i class="fas fa-arrow-down"></i> 3%';
  document.getElementById("savings-change").innerHTML =
    '<i class="fas fa-arrow-up"></i> 10%';
}

// Calcular totales financieros
function calcularTotales() {
  // Obtener transacciones en el período actual
  const fechaInicio = getPeriodStartDate(APP_STATE.period);
  const transaccionesPeriodo = APP_STATE.transacciones.filter(
    (tx) => new Date(tx.fecha) >= fechaInicio
  );

  // Calcular totales
  const ingresos = transaccionesPeriodo
    .filter((tx) => tx.tipo === "income")
    .reduce((sum, tx) => sum + tx.monto, 0);

  const gastos = transaccionesPeriodo
    .filter((tx) => tx.tipo === "expense")
    .reduce((sum, tx) => sum + tx.monto, 0);

  const ahorros = ingresos - gastos;

  return { ingresos, gastos, ahorros };
}

// Obtener fecha de inicio según el período seleccionado
function getPeriodStartDate(period) {
  const today = new Date();
  const days = CONFIG.periodos[period];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  return startDate;
}

// Actualizar lista de transacciones
function updateTransactionsList() {
  const container = document.getElementById("transactions-container");

  // Obtener transacciones ordenadas por fecha (más recientes primero)
  const transaccionesOrdenadas = [...APP_STATE.transacciones]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5); // Mostrar solo las 5 más recientes

  // Si no hay transacciones, mostrar mensaje
  if (transaccionesOrdenadas.length === 0) {
    container.innerHTML =
      '<div class="empty-state">No hay transacciones registradas. ¡Añade una!</div>';
    return;
  }

  // Generar HTML para cada transacción
  const transaccionesHTML = transaccionesOrdenadas
    .map((tx) => {
      // Obtener detalles de la categoría
      const categoria =
        tx.tipo === "income"
          ? CONFIG.categorias.ingresos.find((c) => c.id === tx.categoria)
          : CONFIG.categorias.gastos.find((c) => c.id === tx.categoria);

      const categoriaName = categoria ? categoria.nombre : "Sin categoría";

      // Formatear fecha
      const fecha = new Date(tx.fecha).toLocaleDateString(
        "es-ES",
        CONFIG.dateFormat
      );

      return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-title">${
                      tx.descripcion || categoriaName
                    }</div>
                    <div class="transaction-date">${fecha}</div>
                </div>
                <span class="transaction-category">${categoriaName}</span>
                <div class="transaction-amount ${tx.tipo}">
                    ${tx.tipo === "income" ? "+" : "-"} ${
        CONFIG.currency
      } ${tx.monto.toFixed(2)}
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = transaccionesHTML;
}

// Actualizar gráfico de categorías
function updateCategoriesChart() {
  // Esta función será implementada en charts.js
  // Aquí solo actualizamos los datos que utilizará el gráfico

  // Obtener transacciones en el período actual
  const fechaInicio = getPeriodStartDate(APP_STATE.period);
  const gastosPeriodo = APP_STATE.transacciones.filter(
    (tx) => tx.tipo === "expense" && new Date(tx.fecha) >= fechaInicio
  );

  // Agrupar gastos por categoría
  const gastosPorCategoria = {};

  gastosPeriodo.forEach((tx) => {
    if (!gastosPorCategoria[tx.categoria]) {
      gastosPorCategoria[tx.categoria] = 0;
    }
    gastosPorCategoria[tx.categoria] += tx.monto;
  });

  // Actualizar lista de categorías
  const categoriasContainer = document.getElementById("categories-container");

  // Si no hay categorías con gastos, mostrar mensaje
  if (Object.keys(gastosPorCategoria).length === 0) {
    categoriasContainer.innerHTML =
      '<div class="empty-state">No hay gastos registrados en este período.</div>';
    return;
  }

  // Calcular el total de gastos
  const totalGastos = Object.values(gastosPorCategoria).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // Generar HTML para cada categoría
  const categoriasHTML = Object.entries(gastosPorCategoria)
    .map(([categoryId, amount]) => {
      // Obtener detalles de la categoría
      const categoria = CONFIG.categorias.gastos.find(
        (c) => c.id === categoryId
      );
      if (!categoria) return "";

      // Calcular porcentaje
      const porcentaje = ((amount / totalGastos) * 100).toFixed(1);

      return `
            <div class="category-item">
                <div class="category-name">
                    <div class="category-indicator" style="background-color: ${
                      categoria.color
                    }"></div>
                    <span>${categoria.nombre}</span>
                </div>
                <div class="category-amount">${
                  CONFIG.currency
                } ${amount.toFixed(2)}</div>
                <div class="category-percentage">${porcentaje}% del total</div>
            </div>
        `;
    })
    .join("");

  categoriasContainer.innerHTML = categoriasHTML;

  // Llamar a la función en charts.js para actualizar el gráfico de categorías
  if (typeof updateCategoryPieChart === "function") {
    updateCategoryPieChart(gastosPorCategoria);
  }
}

// Actualizar lista de metas de ahorro
function updateGoalsList() {
  const container = document.getElementById("goals-container");

  // Si no hay metas, mostrar mensaje
  if (APP_STATE.metas.length === 0) {
    container.innerHTML =
      '<div class="empty-state">No hay metas de ahorro. ¡Añade una!</div>';
    return;
  }

  // Generar HTML para cada meta
  const metasHTML = APP_STATE.metas
    .map((meta) => {
      // Calcular porcentaje de progreso
      const progreso = Math.min(
        100,
        ((meta.actual / meta.monto) * 100).toFixed(1)
      );

      // Formatear fecha
      const fecha = new Date(meta.fecha).toLocaleDateString(
        "es-ES",
        CONFIG.dateFormat
      );

      return `
            <div class="goal-card" data-id="${meta.id}">
                <div class="goal-info">
                    <div class="goal-name">${meta.nombre}</div>
                    <div class="goal-target">
                        <span>Meta: ${CONFIG.currency} ${meta.monto.toFixed(
        2
      )}</span>
                        <span>Actual: ${CONFIG.currency} ${meta.actual.toFixed(
        2
      )}</span>
                    </div>
                    <div class="goal-date">Fecha objetivo: ${fecha}</div>
                    <div class="goal-progress">
                        <div class="goal-progress-bar" style="width: ${progreso}%; background-color: ${
        meta.color
      }"></div>
                    </div>
                    <div class="goal-status">
                        <span>Progreso</span>
                        <span class="goal-percentage">${progreso}%</span>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = metasHTML;
}

// Actualizar gráficos
function updateCharts() {
  // Esta función será implementada en charts.js
  // Aquí solo preparamos los datos que utilizarán los gráficos

  // Obtener datos según el período seleccionado
  const fechaInicio = getPeriodStartDate(APP_STATE.period);
  const transaccionesPeriodo = APP_STATE.transacciones.filter(
    (tx) => new Date(tx.fecha) >= fechaInicio
  );

  // Si la función existe (definida en charts.js), actualizar gráfico principal
  if (typeof updateFinanceChart === "function") {
    updateFinanceChart(transaccionesPeriodo, APP_STATE.period);
  }

  // También actualizar el gráfico de categorías
  updateCategoriesChart();
}
