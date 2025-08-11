// Aplicación principal para Control Financiero con Firebase
// Maneja la lógica de la aplicación y la interacción con la API de Firebase

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar la aplicación cuando el DOM esté listo
  initApp();
});

// Variables globales
let currentUser = null;
let categoriesList = [];
let transactionsList = [];
let goalsList = [];
let chartsInstances = {};

// Objetos modales de Bootstrap
let transactionModal;
let categoryModal;
let goalModal;

// Inicializar la aplicación
async function initApp() {
  console.log("🚀 Iniciando aplicación de Control Financiero");

  // Ocultar pantalla de carga cuando todo esté listo
  window.addEventListener("load", () => {
    // Hay que esperar un poco para que se carguen todos los recursos
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("auth-screen").style.display = "block";
    }, 500);
  });

  // Inicializar modales de Bootstrap
  initModals();

  // Configurar eventos de navegación
  setupNavigation();

  // Configurar eventos de autenticación
  setupAuthEvents();

  // Inicializar Firebase
  try {
    await window.API.init();
    console.log("✅ Firebase API inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase API:", error);
    showAuthError(
      "Error al inicializar la aplicación. Por favor, recarga la página."
    );
  }

  // Verificar si hay un usuario ya autenticado
  checkAuthStatus();
}

// Inicializar modales de Bootstrap
function initModals() {
  // Crear instancias de los modales
  transactionModal = new bootstrap.Modal(
    document.getElementById("transactionModal")
  );
  categoryModal = new bootstrap.Modal(document.getElementById("categoryModal"));
  goalModal = new bootstrap.Modal(document.getElementById("goalModal"));

  // Configurar eventos de los modales
  setupTransactionModalEvents();
  setupCategoryModalEvents();
  setupGoalModalEvents();
}

// Configurar eventos de navegación
function setupNavigation() {
  // Enlaces de navegación principal
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // Eliminar la clase active de todos los enlaces
      document.querySelectorAll(".navbar-nav .nav-link").forEach((l) => {
        l.classList.remove("active");
      });
      // Añadir la clase active al enlace clicado
      e.target.classList.add("active");

      // Mostrar la página correspondiente
      const page = e.target.getAttribute("data-page");
      showPage(page);
    });
  });

  // Botones para añadir nuevas transacciones
  document
    .getElementById("add-transaction-btn")
    .addEventListener("click", () => {
      openTransactionModal();
    });

  document
    .getElementById("add-transaction-btn-2")
    .addEventListener("click", () => {
      openTransactionModal();
    });

  // Botón para añadir categoría
  document.getElementById("add-category-btn").addEventListener("click", () => {
    openCategoryModal();
  });

  // Botón para añadir meta
  document.getElementById("add-goal-btn").addEventListener("click", () => {
    openGoalModal();
  });

  // Botones de filtros de transacciones
  document.getElementById("filter-apply").addEventListener("click", () => {
    applyTransactionFilters();
  });

  document.getElementById("filter-reset").addEventListener("click", () => {
    resetTransactionFilters();
  });

  // Configurar eventos para reportes
  setupReportEvents();
}

// Configurar eventos de reportes
function setupReportEvents() {
  const reportPeriod = document.getElementById("report-period");
  const dateFromContainer = document.getElementById(
    "report-date-from-container"
  );
  const dateToContainer = document.getElementById("report-date-to-container");

  // Mostrar/ocultar campos de fecha según el período seleccionado
  reportPeriod.addEventListener("change", () => {
    if (reportPeriod.value === "custom") {
      dateFromContainer.style.display = "block";
      dateToContainer.style.display = "block";
    } else {
      dateFromContainer.style.display = "none";
      dateToContainer.style.display = "none";
    }
  });

  // Generar informe
  document.getElementById("report-generate").addEventListener("click", () => {
    generateReport();
  });
}

// Configurar eventos de autenticación
function setupAuthEvents() {
  // Mostrar/ocultar formularios
  document.getElementById("show-register").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
  });

  document.getElementById("show-login").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  });

  // Iniciar sesión
  document.getElementById("login-button").addEventListener("click", () => {
    login();
  });

  // Iniciar sesión con Google
  document
    .getElementById("google-login-button")
    .addEventListener("click", () => {
      loginWithGoogle();
    });

  // Registrar nuevo usuario
  document.getElementById("register-button").addEventListener("click", () => {
    register();
  });

  // Cerrar sesión
  document.getElementById("logout-button").addEventListener("click", () => {
    logout();
  });

  // Escuchar eventos de tecla en campos de formulario
  document
    .getElementById("login-password")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        login();
      }
    });

  document
    .getElementById("register-password")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        register();
      }
    });
}

// Configurar eventos del modal de transacción
function setupTransactionModalEvents() {
  // Guardar transacción
  document.getElementById("save-transaction").addEventListener("click", () => {
    saveTransaction();
  });

  // Actualizar categorías cuando cambia el tipo
  document.getElementById("transaction-type").addEventListener("change", () => {
    updateTransactionCategories();
  });
}

// Configurar eventos del modal de categoría
function setupCategoryModalEvents() {
  // Guardar categoría
  document.getElementById("save-category").addEventListener("click", () => {
    saveCategory();
  });

  // Actualizar color según el tipo seleccionado
  document.getElementById("category-type").addEventListener("change", (e) => {
    const type = e.target.value;
    const colorInput = document.getElementById("category-color");

    // Asignar color según el tipo
    if (type === "ingreso") {
      colorInput.value = "#4CAF50";
    } else if (type === "gasto") {
      colorInput.value = "#F44336";
    } else if (type === "ahorro") {
      colorInput.value = "#2196F3";
    }
  });
}

// Configurar eventos del modal de meta
function setupGoalModalEvents() {
  // Guardar meta
  document.getElementById("save-goal").addEventListener("click", () => {
    saveGoal();
  });
}

// Verificar estado de autenticación
function checkAuthStatus() {
  const user = window.API.obtenerUsuarioActual();

  if (user) {
    console.log("👤 Usuario autenticado:", user);
    userAuthenticated(user);
  } else {
    console.log("👤 No hay usuario autenticado");
    userNotAuthenticated();
  }
}

// Iniciar sesión
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Validar campos
  if (!email || !password) {
    showAuthError("Por favor ingresa tu correo y contraseña");
    return;
  }

  try {
    // Mostrar indicador de carga
    document.getElementById("login-button").innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando...';
    document.getElementById("login-button").disabled = true;

    // Iniciar sesión
    const user = await window.API.iniciarSesion(email, password);
    console.log("✅ Inicio de sesión exitoso:", user);

    // Actualizar UI
    userAuthenticated(user);
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);

    // Mostrar mensaje de error
    let errorMessage = "Error al iniciar sesión";
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      errorMessage = "Correo o contraseña incorrectos";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
    }

    showAuthError(errorMessage);
  } finally {
    // Restaurar botón
    document.getElementById("login-button").innerHTML = "Iniciar sesión";
    document.getElementById("login-button").disabled = false;
  }
}

// Iniciar sesión con Google
async function loginWithGoogle() {
  try {
    // Mostrar indicador de carga
    document.getElementById("google-login-button").innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando...';
    document.getElementById("google-login-button").disabled = true;

    // Iniciar sesión con Google
    const user = await window.API.iniciarSesionConGoogle();
    console.log("✅ Inicio de sesión con Google exitoso:", user);

    // Actualizar UI
    userAuthenticated(user);
  } catch (error) {
    console.error("❌ Error al iniciar sesión con Google:", error);
    showAuthError("Error al iniciar sesión con Google");
  } finally {
    // Restaurar botón
    document.getElementById("google-login-button").innerHTML =
      '<i class="bi bi-google me-2"></i>Iniciar sesión con Google';
    document.getElementById("google-login-button").disabled = false;
  }
}

// Registrar usuario
async function register() {
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  // Validar campos
  if (!name || !email || !password) {
    showAuthError("Por favor completa todos los campos");
    return;
  }

  if (password.length < 6) {
    showAuthError("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    // Mostrar indicador de carga
    document.getElementById("register-button").innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';
    document.getElementById("register-button").disabled = true;

    // Registrar usuario
    const user = await window.API.registrarUsuario(email, password, name);
    console.log("✅ Registro exitoso:", user);

    // Actualizar UI
    userAuthenticated(user);
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);

    // Mostrar mensaje de error
    let errorMessage = "Error al registrar usuario";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "El correo ya está en uso. Intenta iniciar sesión";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "El correo no es válido";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "La contraseña es demasiado débil";
    }

    showAuthError(errorMessage);
  } finally {
    // Restaurar botón
    document.getElementById("register-button").innerHTML = "Registrarme";
    document.getElementById("register-button").disabled = false;
  }
}

// Cerrar sesión
async function logout() {
  try {
    await window.API.cerrarSesion();
    console.log("✅ Sesión cerrada correctamente");
    userNotAuthenticated();
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
  }
}

// Usuario autenticado
function userAuthenticated(user) {
  currentUser = user;

  // Actualizar UI
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("user-name").textContent =
    user.displayName || user.email;

  // Limpiar errores
  document.getElementById("auth-error").style.display = "none";

  // Limpiar formularios
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("register-name").value = "";
  document.getElementById("register-email").value = "";
  document.getElementById("register-password").value = "";

  // Inicializar la aplicación
  loadInitialData();
}

// Usuario no autenticado
function userNotAuthenticated() {
  currentUser = null;

  // Actualizar UI
  document.getElementById("auth-screen").style.display = "block";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("app").style.display = "none";

  // Limpiar datos
  categoriesList = [];
  transactionsList = [];
  goalsList = [];
}

// Mostrar error de autenticación
function showAuthError(message) {
  const errorEl = document.getElementById("auth-error");
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

// Mostrar página específica
function showPage(page) {
  // Ocultar todas las páginas
  document.querySelectorAll(".page-content").forEach((pageEl) => {
    pageEl.style.display = "none";
  });

  // Mostrar página solicitada
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.style.display = "block";

    // Cargar datos específicos de la página
    switch (page) {
      case "dashboard":
        loadDashboardData();
        break;
      case "transactions":
        loadTransactionsPage();
        break;
      case "categories":
        loadCategoriesPage();
        break;
      case "goals":
        loadGoalsPage();
        break;
      case "reports":
        initReportsPage();
        break;
    }
  }
}

// Cargar datos iniciales
async function loadInitialData() {
  try {
    // Mostrar dashboard inicialmente
    showPage("dashboard");

    // Cargar categorías primero (las necesitaremos para otras operaciones)
    await loadCategories();

    // Cargar transacciones
    await loadTransactions();

    // Cargar metas
    await loadGoals();
  } catch (error) {
    console.error("❌ Error al cargar datos iniciales:", error);
  }
}

// Cargar categorías
async function loadCategories() {
  try {
    categoriesList = await window.API.obtenerCategorias();
    console.log("✅ Categorías cargadas:", categoriesList.length);

    // Si no hay categorías, crear algunas por defecto
    if (categoriesList.length === 0) {
      await createDefaultCategories();
      categoriesList = await window.API.obtenerCategorias();
    }

    return categoriesList;
  } catch (error) {
    console.error("❌ Error al cargar categorías:", error);
    throw error;
  }
}

// Cargar transacciones
async function loadTransactions() {
  try {
    // Obtener transacciones del último mes por defecto
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const options = {
      desde: formatDateForAPI(startOfMonth),
      hasta: formatDateForAPI(today),
      limite: 100,
    };

    transactionsList = await window.API.obtenerTransacciones(options);
    console.log("✅ Transacciones cargadas:", transactionsList.length);

    return transactionsList;
  } catch (error) {
    console.error("❌ Error al cargar transacciones:", error);
    throw error;
  }
}

// Cargar metas
async function loadGoals() {
  try {
    goalsList = await window.API.obtenerMetas();
    console.log("✅ Metas cargadas:", goalsList.length);

    return goalsList;
  } catch (error) {
    console.error("❌ Error al cargar metas:", error);
    throw error;
  }
}

// Crear categorías por defecto
async function createDefaultCategories() {
  console.log("🔄 Creando categorías por defecto...");

  const defaultCategories = [
    { nombre: "Salario", tipo: "ingreso", color: "#4CAF50" },
    { nombre: "Freelance", tipo: "ingreso", color: "#8BC34A" },
    { nombre: "Otros ingresos", tipo: "ingreso", color: "#009688" },

    { nombre: "Alimentación", tipo: "gasto", color: "#F44336" },
    { nombre: "Transporte", tipo: "gasto", color: "#FF9800" },
    { nombre: "Vivienda", tipo: "gasto", color: "#FF5722" },
    { nombre: "Servicios", tipo: "gasto", color: "#9C27B0" },
    { nombre: "Entretenimiento", tipo: "gasto", color: "#673AB7" },
    { nombre: "Salud", tipo: "gasto", color: "#E91E63" },

    { nombre: "Fondo de emergencia", tipo: "ahorro", color: "#2196F3" },
    { nombre: "Inversiones", tipo: "ahorro", color: "#03A9F4" },
  ];

  try {
    // Crear cada categoría
    for (const cat of defaultCategories) {
      await window.API.agregarCategoria(cat);
    }

    console.log("✅ Categorías por defecto creadas");
  } catch (error) {
    console.error("❌ Error al crear categorías por defecto:", error);
    throw error;
  }
}

// Cargar datos del dashboard
function loadDashboardData() {
  // Actualizar resumen
  updateDashboardSummary();

  // Cargar transacciones recientes
  loadRecentTransactions();

  // Crear/actualizar gráficos
  createDashboardCharts();
}

// Actualizar resumen del dashboard
function updateDashboardSummary() {
  // Calcular totales para el mes actual
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const currentMonthTransactions = transactionsList.filter((tx) => {
    const txDate = new Date(tx.fecha);
    return txDate >= startOfMonth && txDate <= endOfMonth;
  });

  // Calcular totales
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalSavings = 0;

  currentMonthTransactions.forEach((tx) => {
    if (tx.tipo === "ingreso") {
      totalIncome += tx.monto;
    } else if (tx.tipo === "gasto") {
      totalExpenses += tx.monto;
    } else if (tx.tipo === "ahorro") {
      totalSavings += tx.monto;
    }
  });

  const balance = totalIncome - totalExpenses;

  // Actualizar UI
  document.getElementById("total-income").textContent =
    formatCurrency(totalIncome);
  document.getElementById("total-expenses").textContent =
    formatCurrency(totalExpenses);
  document.getElementById("total-savings").textContent =
    formatCurrency(totalSavings);
  document.getElementById("total-balance").textContent =
    formatCurrency(balance);
}

// Cargar transacciones recientes
function loadRecentTransactions() {
  const container = document.getElementById("recent-transactions");

  if (!transactionsList || transactionsList.length === 0) {
    container.innerHTML =
      '<div class="text-center py-4"><p>No hay transacciones recientes</p></div>';
    return;
  }

  // Ordenar por fecha (más recientes primero)
  const sortedTransactions = [...transactionsList].sort((a, b) => {
    return new Date(b.fecha) - new Date(a.fecha);
  });

  // Limitar a las 10 más recientes
  const recentTransactions = sortedTransactions.slice(0, 10);

  // Crear HTML
  let html = '<div class="list-group list-group-flush">';

  recentTransactions.forEach((tx) => {
    // Encontrar la categoría
    const categoryName = getCategoryName(tx.categoria);

    // Determinar clase CSS según el tipo
    let typeClass = "";
    let typeIcon = "";

    if (tx.tipo === "ingreso") {
      typeClass = "transaction-income";
      typeIcon = "bi-graph-up-arrow";
    } else if (tx.tipo === "gasto") {
      typeClass = "transaction-expense";
      typeIcon = "bi-graph-down-arrow";
    } else if (tx.tipo === "ahorro") {
      typeClass = "transaction-savings";
      typeIcon = "bi-piggy-bank";
    }

    html += `
      <div class="list-group-item transaction-item ${typeClass}">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="d-flex align-items-center">
              <i class="bi ${typeIcon} me-2"></i>
              <strong>${categoryName}</strong>
            </div>
            <small class="text-muted">${formatDateForDisplay(tx.fecha)} - ${
      tx.descripcion || "Sin descripción"
    }</small>
          </div>
          <span class="badge ${
            tx.tipo === "gasto"
              ? "bg-danger"
              : tx.tipo === "ingreso"
              ? "bg-success"
              : "bg-primary"
          } rounded-pill">
            ${tx.tipo === "gasto" ? "-" : "+"} ${formatCurrency(tx.monto)}
          </span>
        </div>
      </div>
    `;
  });

  html += "</div>";
  container.innerHTML = html;
}

// Crear gráficos del dashboard
function createDashboardCharts() {
  // Destruir gráficos existentes
  if (chartsInstances.monthlyChart) {
    chartsInstances.monthlyChart.destroy();
  }

  if (chartsInstances.expensesChart) {
    chartsInstances.expensesChart.destroy();
  }

  // Preparar datos para el gráfico mensual
  const monthlyData = prepareMonthlyChartData();

  // Preparar datos para el gráfico de distribución de gastos
  const expensesData = prepareExpensesChartData();

  // Crear gráfico de evolución mensual
  const monthlyCtx = document.getElementById("monthly-chart").getContext("2d");
  chartsInstances.monthlyChart = new Chart(monthlyCtx, {
    type: "line",
    data: {
      labels: monthlyData.labels,
      datasets: [
        {
          label: "Ingresos",
          data: monthlyData.ingresos,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Gastos",
          data: monthlyData.gastos,
          borderColor: "#F44336",
          backgroundColor: "rgba(244, 67, 54, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "Evolución mensual",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "S/. " + value;
            },
          },
        },
      },
    },
  });

  // Crear gráfico de distribución de gastos
  const expensesCtx = document
    .getElementById("expenses-chart")
    .getContext("2d");
  chartsInstances.expensesChart = new Chart(expensesCtx, {
    type: "doughnut",
    data: {
      labels: expensesData.labels,
      datasets: [
        {
          data: expensesData.valores,
          backgroundColor: expensesData.colores,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: false,
          text: "Distribución de gastos",
        },
      },
    },
  });
}

// Preparar datos para el gráfico mensual
function prepareMonthlyChartData() {
  // Obtener los últimos 6 meses
  const today = new Date();
  const labels = [];
  const ingresos = [];
  const gastos = [];

  // Generar labels y datos para los últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleDateString("es", { month: "short" });
    const year = month.getFullYear();
    labels.push(`${monthName} ${year}`);

    // Calcular totales para ese mes
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    let totalIngresos = 0;
    let totalGastos = 0;

    transactionsList.forEach((tx) => {
      const txDate = new Date(tx.fecha);
      if (txDate >= startOfMonth && txDate <= endOfMonth) {
        if (tx.tipo === "ingreso") {
          totalIngresos += tx.monto;
        } else if (tx.tipo === "gasto") {
          totalGastos += tx.monto;
        }
      }
    });

    ingresos.push(totalIngresos);
    gastos.push(totalGastos);
  }

  return { labels, ingresos, gastos };
}

// Preparar datos para el gráfico de distribución de gastos
function prepareExpensesChartData() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Filtrar gastos del mes actual
  const gastos = transactionsList.filter((tx) => {
    const txDate = new Date(tx.fecha);
    return (
      tx.tipo === "gasto" && txDate >= startOfMonth && txDate <= endOfMonth
    );
  });

  // Agrupar por categoría
  const gastosPorCategoria = {};

  gastos.forEach((tx) => {
    const categoryId = tx.categoria;

    if (!gastosPorCategoria[categoryId]) {
      gastosPorCategoria[categoryId] = {
        total: 0,
        nombre: getCategoryName(categoryId),
        color: getCategoryColor(categoryId),
      };
    }

    gastosPorCategoria[categoryId].total += tx.monto;
  });

  // Convertir a arrays para Chart.js
  const labels = [];
  const valores = [];
  const colores = [];

  Object.values(gastosPorCategoria).forEach((cat) => {
    labels.push(cat.nombre);
    valores.push(cat.total);
    colores.push(cat.color);
  });

  return { labels, valores, colores };
}

// Cargar página de transacciones
function loadTransactionsPage() {
  // Llenar selector de categorías para filtro
  fillCategorySelector("filter-category", true);

  // Establecer fechas por defecto en filtros
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  document.getElementById("filter-date-from").value =
    formatDateForInput(startOfMonth);
  document.getElementById("filter-date-to").value = formatDateForInput(today);

  // Mostrar transacciones
  displayTransactionsTable(transactionsList);
}

// Cargar página de categorías
function loadCategoriesPage() {
  // Mostrar todas las categorías
  displayCategories();
}
