chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "resaltar") {
    const folios = message.folios;

    let filasMarcadas = [];

    // Limpiar marcas anteriores
    document.querySelectorAll("table tbody tr").forEach((fila) => {
      const checkbox = fila.querySelector("input[type='checkbox']");
      if (checkbox) {
        checkbox.checked = false; // Desmarcar todos los checkboxes
      }
    });

    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll("table tbody tr");

    // Iterar sobre las filas de la tabla
    filas.forEach((fila) => {
      const cuenta = fila.querySelector("td:nth-child(1)").innerText.trim().toLowerCase(); // Normalizamos el valor
      if (folios.includes(cuenta)) {
        const checkbox = fila.querySelector("input[type='checkbox']");
        if (checkbox) {
          checkbox.checked = true; // Marcar el checkbox si coincide
        }
        filasMarcadas.push(fila);
      }
    });

    // Retornar un objeto con el número total de filas marcadas
    sendResponse({ success: true, total: filasMarcadas.length });
  }
  return true; // Importante para que la respuesta asíncrona funcione
});
