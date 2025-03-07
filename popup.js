document.getElementById("fileInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) {
    alert("Por favor, selecciona un archivo.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Obtener la primera hoja del archivo Excel
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convertir la hoja a JSON (array de arrays)
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Extraer solo la columna 1 (primera columna) y normalizar valores
    const columna1 = jsonData
      .map((row) => row[0]?.toString().trim()) // Convertimos a string y eliminamos espacios
      .filter((folio) => folio); // Filtramos valores vacíos

    console.log("Folios del archivo Excel:", columna1); // Verificar los folios

    // Enviar los folios al content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "resaltar", folios: columna1 },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error al enviar mensaje:", chrome.runtime.lastError);
            return;
          }
          if (response && response.success) {
            alert(`Checkboxes marcados correctamente (${response.total} encontrados).`);
          } else {
            alert("No se encontraron coincidencias en la tabla.");
          }
        }
      );
    });
  };

  reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
});
