// Utilidades para crear y manejar modales en la aplicación

/**
 * Crear y mostrar un modal con datos en formato de tabla
 * @param {string} title - Título del modal
 * @param {Array|Object} data - Datos para mostrar en el modal
 */
function showDataModal(title, data) {
  console.log("📊 Mostrando datos en modal:", title);

  // Comprobar si ya existe un modal abierto y cerrarlo
  const existingModal = document.querySelector(".data-modal");
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  // Crear elementos del modal
  const modal = document.createElement("div");
  modal.className = "data-modal modal";
  modal.style.display = "block";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = title;

  const closeButton = document.createElement("button");
  closeButton.className = "close-modal";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = function () {
    document.body.removeChild(modal);
  };

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";

  // Crear tabla con los datos
  if (Array.isArray(data) && data.length > 0) {
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container";
    tableContainer.style.maxHeight = "400px";
    tableContainer.style.overflowY = "auto";

    const table = document.createElement("table");
    table.className = "data-table";

    // Crear encabezados
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Determinar los encabezados
    const headers = Array.isArray(data[0]) ? data[0] : Object.keys(data[0]);

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear filas de datos
    const tbody = document.createElement("tbody");

    // Comenzar desde el índice 1 si el primer elemento son los encabezados
    const startIndex = Array.isArray(data[0]) ? 1 : 0;

    for (let i = startIndex; i < data.length; i++) {
      const row = document.createElement("tr");

      if (Array.isArray(data[i])) {
        data[i].forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell !== null && cell !== undefined ? cell : "";
          row.appendChild(td);
        });
      } else {
        Object.values(data[i]).forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell !== null && cell !== undefined ? cell : "";
          row.appendChild(td);
        });
      }

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    modalBody.appendChild(tableContainer);
  } else {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "No hay datos disponibles para mostrar.";
    modalBody.appendChild(emptyMessage);
  }

  // Botones de acción
  const actionsContainer = document.createElement("div");
  actionsContainer.className = "modal-actions";

  const closeModalButton = document.createElement("button");
  closeModalButton.className = "btn secondary";
  closeModalButton.textContent = "Cerrar";
  closeModalButton.onclick = function () {
    document.body.removeChild(modal);
  };

  actionsContainer.appendChild(closeModalButton);
  modalBody.appendChild(actionsContainer);

  // Construir el modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  // Añadir al body
  document.body.appendChild(modal);

  // Manejar clic fuera del modal para cerrar
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });

  console.log("✅ Modal de datos mostrado correctamente");
}

// Exportar funciones
window.showDataModal = showDataModal;
