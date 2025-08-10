// Gráficos de la aplicación usando Chart.js

// Variables para los gráficos
let financeChart = null;
let categoryPieChart = null;

// Colores para los gráficos
const CHART_COLORS = {
  income: "rgba(76, 175, 80, 0.7)",
  expense: "rgba(244, 67, 54, 0.7)",
  savings: "rgba(33, 150, 243, 0.7)",
  border: {
    income: "rgba(76, 175, 80, 1)",
    expense: "rgba(244, 67, 54, 1)",
    savings: "rgba(33, 150, 243, 1)",
  },
};

// Inicializar los gráficos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // Crear gráficos vacíos
  initCharts();
});

// Inicializar los gráficos
function initCharts() {
  // Gráfico de finanzas
  const financeCtx = document.getElementById("finance-chart").getContext("2d");
  financeChart = new Chart(financeCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Ingresos",
          data: [],
          backgroundColor: CHART_COLORS.income,
          borderColor: CHART_COLORS.border.income,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: "Gastos",
          data: [],
          backgroundColor: CHART_COLORS.expense,
          borderColor: CHART_COLORS.border.expense,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: "Ahorros",
          data: [],
          backgroundColor: CHART_COLORS.savings,
          borderColor: CHART_COLORS.border.savings,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              label += CONFIG.currency + " " + context.parsed.y.toFixed(2);
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return CONFIG.currency + " " + value;
            },
          },
        },
      },
    },
  });

  // Gráfico de categorías (pie chart)
  const categoryCtx = document
    .getElementById("categories-chart")
    .getContext("2d");
  categoryPieChart = new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const total = context.chart.getDatasetMeta(0).total;
              const percentage = ((value / total) * 100).toFixed(1);
              return (
                CONFIG.currency +
                " " +
                value.toFixed(2) +
                " (" +
                percentage +
                "%)"
              );
            },
          },
        },
      },
      cutout: "60%",
    },
  });
}

// Actualizar el gráfico de finanzas con nuevos datos
function updateFinanceChart(transacciones, period) {
  if (!financeChart) return;

  // Obtener datos para el gráfico según el período
  const { labels, ingresos, gastos, ahorros } = processDataForChart(
    transacciones,
    period
  );

  // Actualizar datos del gráfico
  financeChart.data.labels = labels;
  financeChart.data.datasets[0].data = ingresos;
  financeChart.data.datasets[1].data = gastos;
  financeChart.data.datasets[2].data = ahorros;

  // Actualizar el gráfico
  financeChart.update();
}

// Procesar datos para el gráfico principal
function processDataForChart(transacciones, period) {
  let labels = [];
  let ingresos = [];
  let gastos = [];
  let ahorros = [];

  // Definir el formato de fecha según el período
  let dateFormat;
  let groupingFunction;

  switch (period) {
    case "week":
      dateFormat = { weekday: "short" };
      groupingFunction = (date) =>
        date.toLocaleDateString("es-ES", { weekday: "long" });
      break;
    case "month":
      dateFormat = { day: "numeric" };
      groupingFunction = (date) => date.getDate();
      break;
    case "year":
      dateFormat = { month: "short" };
      groupingFunction = (date) =>
        date.toLocaleDateString("es-ES", { month: "long" });
      break;
  }

  // Agrupar transacciones por fecha
  const groupedData = {};

  // Generar todas las fechas dentro del período
  const today = new Date();
  const startDate = new Date(today);

  // Establecer la fecha de inicio según el período
  if (period === "week") {
    startDate.setDate(today.getDate() - 6);
    for (let i = 0; i <= 6; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = groupingFunction(date);
      labels.push(date.toLocaleDateString("es-ES", dateFormat));
      groupedData[key] = { ingresos: 0, gastos: 0 };
    }
  } else if (period === "month") {
    startDate.setDate(today.getDate() - 29);
    // Crear grupos por días del mes (1 al 30/31)
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = groupingFunction(date);

      // Agrupar en períodos de 5 días para no saturar el gráfico
      const groupIndex = Math.floor(i / 5);
      if (i % 5 === 0) {
        labels.push(date.toLocaleDateString("es-ES", dateFormat));
        ingresos[groupIndex] = 0;
        gastos[groupIndex] = 0;
        ahorros[groupIndex] = 0;
      }

      if (!groupedData[groupIndex]) {
        groupedData[groupIndex] = { ingresos: 0, gastos: 0 };
      }
    }
  } else if (period === "year") {
    // Crear grupos por meses
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), i, 1);
      const key = groupingFunction(date);
      labels.push(date.toLocaleDateString("es-ES", dateFormat));
      groupedData[key] = { ingresos: 0, gastos: 0 };
    }
  }

  // Procesar transacciones
  transacciones.forEach((tx) => {
    const date = new Date(tx.fecha);
    let key;

    if (period === "week") {
      key = groupingFunction(date);
    } else if (period === "month") {
      // Para mes, agrupar en períodos de 5 días
      const daysSinceStart = Math.floor(
        (date - startDate) / (1000 * 60 * 60 * 24)
      );
      key = Math.floor(daysSinceStart / 5);
      if (key < 0 || key >= 6) return; // Ignorar si está fuera del rango
    } else if (period === "year") {
      key = groupingFunction(date);
    }

    if (groupedData[key]) {
      if (tx.tipo === "income") {
        groupedData[key].ingresos += tx.monto;
      } else {
        groupedData[key].gastos += tx.monto;
      }
    }
  });

  // Convertir los datos agrupados en arrays para el gráfico
  if (period === "week" || period === "year") {
    labels.forEach((label, index) => {
      const key =
        period === "week"
          ? new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - (6 - index)
            ).toLocaleDateString("es-ES", { weekday: "long" })
          : new Date(today.getFullYear(), index, 1).toLocaleDateString(
              "es-ES",
              { month: "long" }
            );

      const data = groupedData[key] || { ingresos: 0, gastos: 0 };
      ingresos.push(data.ingresos);
      gastos.push(data.gastos);
      ahorros.push(data.ingresos - data.gastos);
    });
  } else if (period === "month") {
    // Para el período mensual, ya hemos calculado los arrays durante la agrupación
    for (let i = 0; i < 6; i++) {
      // 30 días agrupados en 6 períodos de 5 días
      const data = groupedData[i] || { ingresos: 0, gastos: 0 };
      ingresos[i] = data.ingresos;
      gastos[i] = data.gastos;
      ahorros[i] = data.ingresos - data.gastos;
    }
  }

  return { labels, ingresos, gastos, ahorros };
}

// Actualizar el gráfico de categorías de gastos
function updateCategoryPieChart(gastosPorCategoria) {
  if (!categoryPieChart) return;

  // Preparar datos para el gráfico
  const labels = [];
  const data = [];
  const backgroundColor = [];

  // Recorrer las categorías con gastos
  Object.entries(gastosPorCategoria).forEach(([categoryId, amount]) => {
    // Obtener detalles de la categoría
    const categoria = CONFIG.categorias.gastos.find((c) => c.id === categoryId);
    if (!categoria) return;

    labels.push(categoria.nombre);
    data.push(amount);
    backgroundColor.push(categoria.color);
  });

  // Actualizar datos del gráfico
  categoryPieChart.data.labels = labels;
  categoryPieChart.data.datasets[0].data = data;
  categoryPieChart.data.datasets[0].backgroundColor = backgroundColor;

  // Actualizar el gráfico
  categoryPieChart.update();
}

// Manejar el cambio de tema para actualizar los gráficos
function updateChartsTheme(isDarkTheme) {
  if (!financeChart || !categoryPieChart) return;

  const textColor = isDarkTheme ? "#f5f5f5" : "#333333";
  const gridColor = isDarkTheme
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

  // Actualizar opciones del gráfico de finanzas
  financeChart.options.scales.x.ticks.color = textColor;
  financeChart.options.scales.y.ticks.color = textColor;
  financeChart.options.scales.x.grid.color = gridColor;
  financeChart.options.scales.y.grid.color = gridColor;
  financeChart.options.plugins.legend.labels.color = textColor;

  // Actualizar opciones del gráfico de categorías
  categoryPieChart.options.plugins.legend.labels.color = textColor;

  // Actualizar los gráficos
  financeChart.update();
  categoryPieChart.update();
}

// Exportar gráficos como imágenes
function exportChartAsImage(chartId, fileName) {
  const canvas = document.getElementById(chartId);
  const link = document.createElement("a");
  link.download =
    fileName + "_" + new Date().toISOString().slice(0, 10) + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
