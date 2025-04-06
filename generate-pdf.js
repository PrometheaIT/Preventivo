// Configurazione URL del server (Render o locale)
// const SERVER_URL = "https://preventivo-backend.onrender.com"; // URL di Render
const SERVER_URL = "http://localhost:3000"; // Usa questa per il server locale

function exportToPDF() {
  const btn = document.getElementById("exportPDF");
  btn.disabled = true;

  document.body.classList.add('pdf-export');
  
  // Sincronizza i dati secondari prima della generazione
  document.getElementById("numeroPreventivoSecondario").textContent = 
    document.getElementById("numeroPreventivo").textContent;
  document.getElementById("clientNameSeconda").value = 
    document.getElementById("clientName").value;
  document.getElementById("clientAddressSeconda").value = 
    document.getElementById("clientAddress").value;
  document.getElementById("clientPivaSeconda").value = 
    document.getElementById("clientPiva").value;

  setTimeout(() => {
    const element = document.getElementById("preventivo");
    const opt = {
      margin: [10, 10],
      filename: `Preventivo Promethea N° ${localStorage.getItem("numeroPreventivo")} - 2025.pdf`,
      html2canvas: {
        scale: 0.8,
        scrollY: false,
        useCORS: true,
        logging: true,
        windowWidth: 1200
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        before: '.new-page'
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
        document.body.classList.remove('pdf-export');
        btn.disabled = false;
      });
  }, 100);
}


// Funzioni per la numerazione automatica
async function incrementaNumeroPreventivo() {
  try {
    const response = await fetch("http://localhost:3000/incrementa", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) throw new Error("Errore server");
    
    const data = await response.json();
    localStorage.setItem("numeroPreventivo", data.numeroPreventivo);
    document.getElementById("numeroPreventivo").textContent = data.numeroPreventivo;
    document.getElementById("numeroPreventivoSecondario").textContent = data.numeroPreventivo;
    
  } catch (error) {
    console.error("Fallback su localStorage:", error);
    const fallbackNum = parseInt(localStorage.getItem("numeroPreventivo") || 0) + 1;
    localStorage.setItem("numeroPreventivo", fallbackNum);
    document.getElementById("numeroPreventivo").textContent = fallbackNum;
    document.getElementById("numeroPreventivoSecondario").textContent = fallbackNum;
  }
}

async function caricaNumeroIniziale() {
  try {
    const response = await fetch("http://localhost:3000/numero");
    const data = await response.json();
    localStorage.setItem("numeroPreventivo", data.numeroPreventivo);
    document.getElementById("numeroPreventivo").textContent = data.numeroPreventivo;
    document.getElementById("numeroPreventivoSecondario").textContent = data.numeroPreventivo;
  } catch (error) {
    console.error("Caricamento fallback:", error);
    const numeroFallback = localStorage.getItem("numeroPreventivo") || "1";
    document.getElementById("numeroPreventivo").textContent = numeroFallback;
    document.getElementById("numeroPreventivoSecondario").textContent = numeroFallback;
  }
}

caricaNumeroIniziale();