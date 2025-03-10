console.log("Content script cargado correctamente");

// Función para marcar los checkboxes
function marcarCheckboxes(folios) {
  let filasMarcadas = [];

  // Limpiar marcas anteriores
  document.querySelectorAll("#CPHContenido_gdvResultado tbody tr td .i-checks input[type='checkbox']").forEach(checkbox => {
    checkbox.checked = false;
    // Disparar eventos para iCheck
    const iCheckHelper = checkbox.closest(".i-checks").querySelector(".iCheck-helper");
    if (iCheckHelper) {
      iCheckHelper.click(); // Simular clic en el helper de iCheck
    }
  });

  // Obtener todas las filas de la tabla
  const filas = document.querySelectorAll("#CPHContenido_gdvResultado tbody tr");

  // Iterar sobre las filas de la tabla
  filas.forEach(fila => {
    const cuenta = fila.querySelector("td:nth-child(2) span")?.innerText.trim(); // Cambiado a la segunda columna para "Cuenta"
    console.log("🔍 Buscando cuenta en fila:", cuenta);

    if (cuenta && !folios.includes(cuenta)) {
      console.log("✅ Coincidencia encontrada para:", cuenta);

      const checkbox = fila.querySelector("td .i-checks input[type='checkbox']");
      
      if (!checkbox) {
        console.warn("⚠️ No se encontró checkbox en la fila de la cuenta:", cuenta);
        return;
      }

      // Marcar el checkbox
      checkbox.checked = true;

      // Disparar eventos para iCheck
      const iCheckHelper = checkbox.closest(".i-checks").querySelector(".iCheck-helper");
      if (iCheckHelper) {
        iCheckHelper.click(); // Simular clic en el helper de iCheck
      }

      console.log("✅ Checkbox marcado para:", cuenta);

      filasMarcadas.push(fila);
    }
  });

  console.log("📊 Total filas marcadas:", filasMarcadas.length);
  return filasMarcadas.length;
}

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "resaltar") {
    const folios = message.folios.map(folio => folio.trim()); // Normaliza folios del Excel
    const totalMarcados = marcarCheckboxes(folios);
    sendResponse({ success: true, total: totalMarcados });
  }
  return true; // Importante para respuestas asíncronas
});