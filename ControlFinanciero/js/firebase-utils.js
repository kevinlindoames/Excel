// Utilidades y funciones auxiliares para Control Financiero con Firebase

/**
 * Obtiene el nombre de una categoría a partir de su ID
 * @param {string} categoryId - ID de la categoría
 * @returns {string} - Nombre de la categoría o "Sin categoría" si no se encuentra
 */
function getCategoryName(categoryId) {
  if (!categoryId || !categoriesList || categoriesList.length === 0) {
    return "Sin categoría";
  }

  const category = categoriesList.find((cat) => cat.id === categoryId);
  return category ? category.nombre : "Sin categoría";
}

/**
 * Obtiene el color de una categoría a partir de su ID
 * @param {string} categoryId - ID de la categoría
 * @returns {string} - Color de la categoría o un color por defecto
 */
function getCategoryColor(categoryId) {
  if (!categoryId || !categoriesList || categoriesList.length === 0) {
    return "#9E9E9E"; // Gris por defecto
  }

  const category = categoriesList.find((cat) => cat.id === categoryId);
  return category ? category.color : "#9E9E9E";
}

/**
 * Formatea un valor numérico como moneda
 * @param {number} value - Valor a formatear
 * @param {string} [currency="S/."] - Símbolo de moneda
 * @returns {string} - Valor formateado como moneda
 */
function formatCurrency(value, currency = "S/.") {
  // Verificar si es un número válido
  if (isNaN(value)) {
    return `${currency} 0.00`;
  }

  // Formatear con 2 decimales
  const formattedValue = parseFloat(value).toFixed(2);

  // Añadir separador de miles
  const parts = formattedValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${currency} ${parts.join(".")}`;
}

/**
 * Formatea una fecha para mostrar en la interfaz
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha formateada según la localización
 */
function formatDateForDisplay(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formatea una fecha para usarla en la API
 * @param {Date} date - Objeto Date
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
function formatDateForAPI(date) {
  if (!date || !(date instanceof Date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha para campos de entrada de tipo date
 * @param {Date} date - Objeto Date
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
function formatDateForInput(date) {
  return formatDateForAPI(date);
}

/**
 * Llena un selector con las categorías disponibles
 * @param {string} selectId - ID del elemento select
 * @param {boolean} [includeAll=false] - Incluir opción "Todas"
 * @param {string} [filterType=null] - Filtrar por tipo de categoría
 */
function fillCategorySelector(selectId, includeAll = false, filterType = null) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // Limpiar opciones actuales
  select.innerHTML = includeAll ? '<option value="">Todas</option>' : "";

  // Verificar si hay categorías
  if (!categoriesList || categoriesList.length === 0) {
    return;
  }

  // Filtrar por tipo si es necesario
  let filteredCategories = categoriesList;
  if (filterType) {
    filteredCategories = categoriesList.filter(
      (cat) => cat.tipo === filterType
    );
  }

  // Ordenar por nombre
  filteredCategories.sort((a, b) => a.nombre.localeCompare(b.nombre));

  // Añadir opciones
  filteredCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.nombre;

    // Añadir atributo de color para estilos personalizados
    option.setAttribute("data-color", cat.color);

    select.appendChild(option);
  });
}

/**
 * Actualiza el selector de categorías en el modal de transacción
 * según el tipo seleccionado
 */
function updateTransactionCategories() {
  const type = document.getElementById("transaction-type").value;
  fillCategorySelector("transaction-category", false, type);
}

/**
 * Abre el modal de transacción para una nueva transacción
 */
function openTransactionModal() {
  // Limpiar formulario
  document.getElementById("transaction-form").reset();
  document.getElementById("transaction-id").value = "";

  // Establecer fecha actual
  document.getElementById("transaction-date").value = formatDateForInput(
    new Date()
  );

  // Actualizar categorías según el tipo seleccionado
  updateTransactionCategories();

  // Cambiar título
  document.getElementById("transactionModalTitle").textContent =
    "Nueva transacción";

  // Abrir modal
  transactionModal.show();
}

/**
 * Abre el modal de transacción para editar una transacción existente
 * @param {string} id - ID de la transacción a editar
 */
function openTransactionModalForEdit(id) {
  // Buscar transacción
  const transaction = transactionsList.find((tx) => tx.id === id);
  if (!transaction) return;

  // Llenar formulario
  document.getElementById("transaction-id").value = id;
  document.getElementById("transaction-date").value = transaction.fecha;
  document.getElementById("transaction-type").value = transaction.tipo;
  document.getElementById("transaction-amount").value = transaction.monto;
  document.getElementById("transaction-description").value =
    transaction.descripcion || "";

  // Actualizar categorías y seleccionar la categoría de la transacción
  updateTransactionCategories();
  setTimeout(() => {
    document.getElementById("transaction-category").value =
      transaction.categoria || "";
  }, 100);

  // Cambiar título
  document.getElementById("transactionModalTitle").textContent =
    "Editar transacción";

  // Abrir modal
  transactionModal.show();
}

/**
 * Guarda una transacción (nueva o editada)
 */
async function saveTransaction() {
  // Obtener datos del formulario
  const id = document.getElementById("transaction-id").value;
  const fecha = document.getElementById("transaction-date").value;
  const tipo = document.getElementById("transaction-type").value;
  const categoria = document.getElementById("transaction-category").value;
  const monto = document.getElementById("transaction-amount").value;
  const descripcion = document.getElementById("transaction-description").value;

  // Validar datos
  if (!fecha || !tipo || !monto) {
    alert("Por favor completa los campos requeridos");
    return;
  }

  // Preparar datos
  const transactionData = {
    fecha,
    tipo,
    categoria: categoria || null,
    monto: parseFloat(monto),
    descripcion,
  };

  try {
    // Mostrar indicador de carga
    const saveButton = document.getElementById("save-transaction");
    const originalText = saveButton.textContent;
    saveButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';
    saveButton.disabled = true;

    if (id) {
      // Actualizar transacción existente
      await window.API.actualizarTransaccion(id, transactionData);
      console.log(`✅ Transacción ${id} actualizada correctamente`);

      // Actualizar lista de transacciones
      const index = transactionsList.findIndex((tx) => tx.id === id);
      if (index !== -1) {
        transactionsList[index] = {
          ...transactionsList[index],
          ...transactionData,
        };
      }
    } else {
      // Crear nueva transacción
      const newId = await window.API.agregarTransaccion(transactionData);
      console.log(`✅ Transacción creada con ID: ${newId}`);

      // Añadir a la lista de transacciones
      transactionsList.push({ id: newId, ...transactionData });
    }

    // Cerrar modal
    transactionModal.hide();

    // Actualizar UI
    if (document.getElementById("page-dashboard").style.display !== "none") {
      loadDashboardData();
    } else if (
      document.getElementById("page-transactions").style.display !== "none"
    ) {
      displayTransactionsTable(transactionsList);
    }

    // Mostrar mensaje de éxito
    alert(
      id
        ? "Transacción actualizada correctamente"
        : "Transacción guardada correctamente"
    );
  } catch (error) {
    console.error("❌ Error al guardar transacción:", error);
    alert(`Error al guardar transacción: ${error.message}`);
  } finally {
    // Restaurar botón
    const saveButton = document.getElementById("save-transaction");
    saveButton.textContent = originalText;
    saveButton.disabled = false;
  }
}

/**
 * Elimina una transacción
 * @param {string} id - ID de la transacción a eliminar
 */
async function deleteTransaction(id) {
  if (
    !confirm(
      "¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer."
    )
  ) {
    return;
  }

  try {
    await window.API.eliminarTransaccion(id);
    console.log(`✅ Transacción ${id} eliminada correctamente`);

    // Eliminar de la lista de transacciones
    transactionsList = transactionsList.filter((tx) => tx.id !== id);

    // Actualizar UI
    if (document.getElementById("page-dashboard").style.display !== "none") {
      loadDashboardData();
    } else if (
      document.getElementById("page-transactions").style.display !== "none"
    ) {
      displayTransactionsTable(transactionsList);
    }

    // Mostrar mensaje de éxito
    alert("Transacción eliminada correctamente");
  } catch (error) {
    console.error(`❌ Error al eliminar transacción ${id}:`, error);
    alert(`Error al eliminar transacción: ${error.message}`);
  }
}

/**
 * Muestra la tabla de transacciones con los datos proporcionados
 * @param {Array} transactions - Lista de transacciones
 */
function displayTransactionsTable(transactions) {
  const tableBody = document.getElementById("transactions-table");

  if (!transactions || transactions.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center">No hay transacciones para mostrar</td></tr>';
    return;
  }

  // Ordenar por fecha (más recientes primero)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.fecha) - new Date(a.fecha);
  });

  // Crear filas
  let html = "";

  sortedTransactions.forEach((tx) => {
    // Encontrar la categoría
    const categoryName = getCategoryName(tx.categoria);

    // Determinar clase CSS según el tipo
    let typeClass = "";
    let typeText = "";

    if (tx.tipo === "ingreso") {
      typeClass = "bg-success text-white";
      typeText = "Ingreso";
    } else if (tx.tipo === "gasto") {
      typeClass = "bg-danger text-white";
      typeText = "Gasto";
    } else if (tx.tipo === "ahorro") {
      typeClass = "bg-primary text-white";
      typeText = "Ahorro";
    }

    html += `
      <tr>
        <td>${formatDateForDisplay(tx.fecha)}</td>
        <td><span class="badge ${typeClass}">${typeText}</span></td>
        <td>${categoryName}</td>
        <td>${formatCurrency(tx.monto)}</td>
        <td>${tx.descripcion || "-"}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="openTransactionModalForEdit('${
            tx.id
          }')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction('${
            tx.id
          }')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
}

/**
 * Aplica los filtros de búsqueda a las transacciones
 */
function applyTransactionFilters() {
  // Obtener valores de filtros
  const dateFrom = document.getElementById("filter-date-from").value;
  const dateTo = document.getElementById("filter-date-to").value;
  const type = document.getElementById("filter-type").value;
  const category = document.getElementById("filter-category").value;

  // Validar fechas
  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    alert("La fecha desde no puede ser posterior a la fecha hasta");
    return;
  }

  // Filtrar transacciones
  let filteredTransactions = [...transactionsList];

  if (dateFrom) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.fecha >= dateFrom
    );
  }

  if (dateTo) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.fecha <= dateTo
    );
  }

  if (type) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.tipo === type
    );
  }

  if (category) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.categoria === category
    );
  }

  // Mostrar resultados
  displayTransactionsTable(filteredTransactions);
}

/**
 * Resetea los filtros de transacciones
 */
function resetTransactionFilters() {
  // Establecer fechas por defecto
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  document.getElementById("filter-date-from").value =
    formatDateForInput(startOfMonth);
  document.getElementById("filter-date-to").value = formatDateForInput(today);
  document.getElementById("filter-type").value = "";
  document.getElementById("filter-category").value = "";

  // Mostrar todas las transacciones
  displayTransactionsTable(transactionsList);
}

/**
 * Abre el modal de categoría para una nueva categoría
 */
function openCategoryModal() {
  // Limpiar formulario
  document.getElementById("category-form").reset();
  document.getElementById("category-id").value = "";

  // Establecer color por defecto según el tipo
  const typeSelect = document.getElementById("category-type");
  const colorInput = document.getElementById("category-color");

  if (typeSelect.value === "ingreso") {
    colorInput.value = "#4CAF50";
  } else if (typeSelect.value === "gasto") {
    colorInput.value = "#F44336";
  } else if (typeSelect.value === "ahorro") {
    colorInput.value = "#2196F3";
  }

  // Cambiar título
  document.getElementById("categoryModalTitle").textContent = "Nueva categoría";

  // Abrir modal
  categoryModal.show();
}

/**
 * Abre el modal de categoría para editar una categoría existente
 * @param {string} id - ID de la categoría a editar
 */
function openCategoryModalForEdit(id) {
  // Buscar categoría
  const category = categoriesList.find((cat) => cat.id === id);
  if (!category) return;

  // Llenar formulario
  document.getElementById("category-id").value = id;
  document.getElementById("category-name").value = category.nombre;
  document.getElementById("category-type").value = category.tipo;
  document.getElementById("category-color").value = category.color;

  // Cambiar título
  document.getElementById("categoryModalTitle").textContent =
    "Editar categoría";

  // Abrir modal
  categoryModal.show();
}

/**
 * Guarda una categoría (nueva o editada)
 */
async function saveCategory() {
  // Obtener datos del formulario
  const id = document.getElementById("category-id").value;
  const nombre = document.getElementById("category-name").value;
  const tipo = document.getElementById("category-type").value;
  const color = document.getElementById("category-color").value;

  // Validar datos
  if (!nombre || !tipo) {
    alert("Por favor completa los campos requeridos");
    return;
  }

  // Preparar datos
  const categoryData = {
    nombre,
    tipo,
    color,
  };

  try {
    // Mostrar indicador de carga
    const saveButton = document.getElementById("save-category");
    const originalText = saveButton.textContent;
    saveButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';
    saveButton.disabled = true;

    if (id) {
      // Actualizar categoría existente
      await window.API.actualizarCategoria(id, categoryData);
      console.log(`✅ Categoría ${id} actualizada correctamente`);

      // Actualizar lista de categorías
      const index = categoriesList.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        categoriesList[index] = { ...categoriesList[index], ...categoryData };
      }
    } else {
      // Crear nueva categoría
      const newId = await window.API.agregarCategoria(categoryData);
      console.log(`✅ Categoría creada con ID: ${newId}`);

      // Añadir a la lista de categorías
      categoriesList.push({ id: newId, ...categoryData });
    }

    // Cerrar modal
    categoryModal.hide();

    // Actualizar UI
    if (document.getElementById("page-categories").style.display !== "none") {
      displayCategories();
    }

    // Mostrar mensaje de éxito
    alert(
      id
        ? "Categoría actualizada correctamente"
        : "Categoría guardada correctamente"
    );
  } catch (error) {
    console.error("❌ Error al guardar categoría:", error);
    alert(`Error al guardar categoría: ${error.message}`);
  } finally {
    // Restaurar botón
    const saveButton = document.getElementById("save-category");
    saveButton.textContent = originalText;
    saveButton.disabled = false;
  }
}

/**
 * Elimina una categoría
 * @param {string} id - ID de la categoría a eliminar
 */
async function deleteCategory(id) {
  // Verificar si hay transacciones que usan esta categoría
  const hasTransactions = transactionsList.some((tx) => tx.categoria === id);

  const message = hasTransactions
    ? "¿Estás seguro de que deseas eliminar esta categoría? Las transacciones asociadas a esta categoría quedarán sin categoría."
    : "¿Estás seguro de que deseas eliminar esta categoría?";

  if (!confirm(message)) {
    return;
  }

  try {
    await window.API.eliminarCategoria(id);
    console.log(`✅ Categoría ${id} eliminada correctamente`);

    // Eliminar de la lista de categorías
    categoriesList = categoriesList.filter((cat) => cat.id !== id);

    // Actualizar transacciones que usaban esta categoría
    if (hasTransactions) {
      transactionsList = transactionsList.map((tx) => {
        if (tx.categoria === id) {
          return { ...tx, categoria: null };
        }
        return tx;
      });
    }

    // Actualizar UI
    displayCategories();

    // Mostrar mensaje de éxito
    alert("Categoría eliminada correctamente");
  } catch (error) {
    console.error(`❌ Error al eliminar categoría ${id}:`, error);
    alert(`Error al eliminar categoría: ${error.message}`);
  }
}

/**
 * Muestra las categorías en las pestañas correspondientes
 */
function displayCategories() {
  // Obtener contenedores
  const allContainer = document.getElementById("all-categories-list");
  const incomeContainer = document.getElementById("income-categories-list");
  const expenseContainer = document.getElementById("expense-categories-list");
  const savingsContainer = document.getElementById("savings-categories-list");

  // Verificar si hay categorías
  if (!categoriesList || categoriesList.length === 0) {
    const noCategories =
      '<div class="col-12 text-center py-4"><p>No hay categorías disponibles</p></div>';
    allContainer.innerHTML = noCategories;
    incomeContainer.innerHTML = noCategories;
    expenseContainer.innerHTML = noCategories;
    savingsContainer.innerHTML = noCategories;
    return;
  }

  // Filtrar por tipo
  const incomeCats = categoriesList.filter((cat) => cat.tipo === "ingreso");
  const expenseCats = categoriesList.filter((cat) => cat.tipo === "gasto");
  const savingsCats = categoriesList.filter((cat) => cat.tipo === "ahorro");

  // Mostrar en cada contenedor
  allContainer.innerHTML = createCategoriesHTML(categoriesList);
  incomeContainer.innerHTML = incomeCats.length
    ? createCategoriesHTML(incomeCats)
    : '<div class="col-12 text-center py-4"><p>No hay categorías de ingresos</p></div>';
  expenseContainer.innerHTML = expenseCats.length
    ? createCategoriesHTML(expenseCats)
    : '<div class="col-12 text-center py-4"><p>No hay categorías de gastos</p></div>';
  savingsContainer.innerHTML = savingsCats.length
    ? createCategoriesHTML(savingsCats)
    : '<div class="col-12 text-center py-4"><p>No hay categorías de ahorros</p></div>';
}

/**
 * Crea el HTML para mostrar las categorías
 * @param {Array} categories - Lista de categorías
 * @returns {string} - HTML con las categorías
 */
function createCategoriesHTML(categories) {
  let html = "";

  categories.forEach((cat) => {
    // Determinar icono según el tipo
    let typeIcon = "";
    let typeClass = "";

    if (cat.tipo === "ingreso") {
      typeIcon = "bi-graph-up-arrow";
      typeClass = "bg-success";
    } else if (cat.tipo === "gasto") {
      typeIcon = "bi-graph-down-arrow";
      typeClass = "bg-danger";
    } else if (cat.tipo === "ahorro") {
      typeIcon = "bi-piggy-bank";
      typeClass = "bg-primary";
    }

    html += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <span class="badge ${typeClass} me-2">
                <i class="bi ${typeIcon}"></i>
              </span>
              ${cat.nombre}
            </h5>
            <div class="category-color" style="width: 20px; height: 20px; border-radius: 50%; background-color: ${
              cat.color
            };"></div>
          </div>
          <div class="card-body">
            <p class="card-text">Tipo: ${
              cat.tipo.charAt(0).toUpperCase() + cat.tipo.slice(1)
            }</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary" onclick="openCategoryModalForEdit('${
              cat.id
            }')">
              <i class="bi bi-pencil me-1"></i>Editar
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${
              cat.id
            }')">
              <i class="bi bi-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

/**
 * Función básica para cargar los datos del dashboard
 * Esta es una versión simplificada que reemplazará la original
 */
function loadDashboardData() {
  console.log("Cargando datos del dashboard...");
  // Actualizar resumen
  updateBalanceSummary();
  // Mostrar transacciones recientes
  displayRecentTransactions();
}

/**
 * Actualiza el resumen de balance
 */
function updateBalanceSummary() {
  // Calcular ingresos, gastos y balance total
  if (!transactionsList || transactionsList.length === 0) {
    document.getElementById("total-income").textContent = formatCurrency(0);
    document.getElementById("total-expense").textContent = formatCurrency(0);
    document.getElementById("total-savings").textContent = formatCurrency(0);
    document.getElementById("total-balance").textContent = formatCurrency(0);
    return;
  }

  // Filtrar por el mes actual
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayStr = formatDateForAPI(firstDayOfMonth);

  const currentMonthTransactions = transactionsList.filter(
    (tx) => tx.fecha >= firstDayStr
  );

  // Calcular totales
  const income = currentMonthTransactions
    .filter((tx) => tx.tipo === "ingreso")
    .reduce((sum, tx) => sum + tx.monto, 0);

  const expense = currentMonthTransactions
    .filter((tx) => tx.tipo === "gasto")
    .reduce((sum, tx) => sum + tx.monto, 0);

  const savings = currentMonthTransactions
    .filter((tx) => tx.tipo === "ahorro")
    .reduce((sum, tx) => sum + tx.monto, 0);

  const balance = income - expense;

  // Actualizar UI
  document.getElementById("total-income").textContent = formatCurrency(income);
  document.getElementById("total-expense").textContent =
    formatCurrency(expense);
  document.getElementById("total-savings").textContent =
    formatCurrency(savings);
  document.getElementById("total-balance").textContent =
    formatCurrency(balance);

  // Actualizar clase del balance según si es positivo o negativo
  const balanceElement = document.getElementById("total-balance");
  if (balance > 0) {
    balanceElement.classList.remove("text-danger");
    balanceElement.classList.add("text-success");
  } else if (balance < 0) {
    balanceElement.classList.remove("text-success");
    balanceElement.classList.add("text-danger");
  } else {
    balanceElement.classList.remove("text-success", "text-danger");
  }
}

/**
 * Muestra las transacciones recientes en el dashboard
 */
function displayRecentTransactions() {
  const container = document.getElementById("recent-transactions");
  if (!container) return;

  if (!transactionsList || transactionsList.length === 0) {
    container.innerHTML =
      '<div class="text-center py-4">No hay transacciones recientes</div>';
    return;
  }

  // Obtener las 5 transacciones más recientes
  const recentTransactions = [...transactionsList]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  let html = "";

  recentTransactions.forEach((tx) => {
    const categoryName = getCategoryName(tx.categoria);

    let typeClass = "";
    if (tx.tipo === "ingreso") {
      typeClass = "text-success";
    } else if (tx.tipo === "gasto") {
      typeClass = "text-danger";
    } else if (tx.tipo === "ahorro") {
      typeClass = "text-primary";
    }

    html += `
      <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
        <div>
          <div class="fw-bold">${tx.descripcion || categoryName}</div>
          <small class="text-muted">${formatDateForDisplay(tx.fecha)}</small>
        </div>
        <span class="${typeClass} fw-bold">${formatCurrency(tx.monto)}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Función para manejar el evento de cambio de tipo en categorías
document.addEventListener("DOMContentLoaded", function () {
  const categoryTypeSelect = document.getElementById("category-type");
  if (categoryTypeSelect) {
    categoryTypeSelect.addEventListener("change", function () {
      const colorInput = document.getElementById("category-color");

      if (this.value === "ingreso") {
        colorInput.value = "#4CAF50";
      } else if (this.value === "gasto") {
        colorInput.value = "#F44336";
      } else if (this.value === "ahorro") {
        colorInput.value = "#2196F3";
      }
    });
  }
});
