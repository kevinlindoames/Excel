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

      // Generar HTML para la meta
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

  // Actualizar contenedor con el HTML generado
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
