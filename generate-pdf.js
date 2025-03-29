function exportToPDF() {
  // Nascondi il bottone
  const btn = document.getElementById("exportPDF");
  if (btn) btn.style.display = "none";
  
  document.body.classList.add("print-mode");
  
  const element = document.getElementById("preventivo");
  if (!element) {
    alert("Elemento con id 'preventivo' non trovato!");
    if (btn) btn.style.display = "";
    document.body.classList.remove("print-mode");
    return;
  }
  
  // Clona l'elemento
  const clone = element.cloneNode(true);
  clone.style.overflow = "visible";
  clone.style.height = "auto";
  
  // Rimuovi eventuali stili problematici o input interattivi se necessario
  clone.querySelectorAll("input").forEach(input => {
    // Imposta il valore come testo statico, se lo desideri
    const span = document.createElement("span");
    span.textContent = input.value;
    input.parentNode.replaceChild(span, input);
  });
  
  // Crea un contenitore temporaneo posizionato fuori dallo schermo
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.top = "-9999px";
  tempContainer.style.left = "-9999px";
  tempContainer.style.display = "block";
  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);
  
  // Usa un valore fisso per il numero (per test)
  const numero = "default";
  
  const opt = {
    margin: [0.1, 0.1, 0.1, 0.1],
    filename: `preventivo_${numero}.pdf`,
    image: { type: "png", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      scrollY: 0
    },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" }
  };
  
  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .then(() => {
        console.log("PDF generato con successo");
      })
      .catch((error) => {
        console.error("Errore durante la generazione del PDF:", error);
        alert("Errore durante la generazione del PDF: " + error.message);
      })
      .finally(() => {
        document.body.removeChild(tempContainer);
        if (btn) btn.style.display = "";
        document.body.classList.remove("print-mode");
      });
  }, 500);
}
