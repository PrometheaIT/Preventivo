function exportToPDF() {
  const btn = document.getElementById("exportPDF");
  btn.disabled = true;

  // Aggiungi classe per nascondere i pulsanti
  document.body.classList.add('pdf-export');
  
  // Sincronizza tutti i dati prima della generazione
  sincronizzaClienti();
  sincronizzaTotali();

  // Forza il reflow per applicare gli stili
  setTimeout(() => {
    const element = document.getElementById("preventivo");
    const opt = {
      margin: [0.8, 0.8],
      filename: `Preventivo Promethea N° ${localStorage.getItem("numeroPreventivo")} - 2025.pdf`,
      html2canvas: {
        scale: 1,
        scrollY: false,
        ignoreElements: (element) => element.classList.contains('no-print'),
        useCORS: true,
        logging: false,
        allowTaint: true
      },
      pagebreak: {
        mode: ['css', 'avoid-all'],
        before: '.new-page',
        avoid: ['table', '.totals-container', '.note', '.condizioni', 'modulo', 'module-table', 'module-table tr', 'module-table td', 'module-table th', '.conditions']
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        console.log("PDF generato con successo");
        incrementaNumeroPreventivo();
      })
      .catch((error) => {
        console.error("Errore generazione PDF:", error);
        alert("Errore generazione PDF: " + error.message);
      })
      .finally(() => {
        // Rimuovi classe e riabilita pulsante
        document.body.classList.remove('pdf-export');
        btn.disabled = false;
      });
  }, 50); // Timeout breve per assicurare l'applicazione degli stili
}

// Funzioni di supporto per la numerazione
async function incrementaNumeroPreventivo() {
  try {
    const response = await fetch("https://preventivo-backend.onrender.com/incrementa", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) throw new Error("Errore server");
    
    const data = await response.json();
    localStorage.setItem("numeroPreventivo", data.numeroPreventivo);
    document.getElementById("numeroPreventivo").textContent = data.numeroPreventivo;
    
  } catch (error) {
    console.error("Fallback su localStorage:", error);
    const fallbackNum = parseInt(localStorage.getItem("numeroPreventivo") || 0) + 1;
    localStorage.setItem("numeroPreventivo", fallbackNum);
    document.getElementById("numeroPreventivo").textContent = fallbackNum;
  }
}

async function caricaNumeroIniziale() {
  try {
    const response = await fetch("https://preventivo-backend.onrender.com/numero");
    const data = await response.json();
    localStorage.setItem("numeroPreventivo", data.numeroPreventivo);
    document.getElementById("numeroPreventivo").textContent = data.numeroPreventivo;
  } catch (error) {
    console.error("Caricamento fallback:", error);
    document.getElementById("numeroPreventivo").textContent = 
      localStorage.getItem("numeroPreventivo") || "1";
  }
}

caricaNumeroIniziale();