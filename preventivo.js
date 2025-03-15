document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".add-row").forEach(button => {
        button.addEventListener("click", function () {
            let moduleSection = this.parentElement; // Il contenitore .module-section
            let tableBody = moduleSection.querySelector(".module-table tbody");

            // Crea la nuova riga con gli input
            let newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" class="Servizio"></td>
                <td><input type="number" class="quantita" value="1" min="1"></td>
                <td><input type="text" class="prezzoMensile" value="0"></td>
                <td><input type="text" class="prezzoUnaTantum" value="0"></td>
            `;

            // Aggiunge la riga alla tabella
            tableBody.appendChild(newRow);

            // Inizializza AutoNumeric per i nuovi campi
            new AutoNumeric(newRow.querySelector(".prezzoMensile"), {
                currencySymbol: " €",
                currencySymbolPlacement: "s",
                decimalCharacter: ",",
                digitGroupSeparator: ".",
                unformatOnSubmit: true
            });
            new AutoNumeric(newRow.querySelector(".prezzoUnaTantum"), {
                currencySymbol: " €",
                currencySymbolPlacement: "s",
                decimalCharacter: ",",
                digitGroupSeparator: ".",
                unformatOnSubmit: true
            });

            // Crea il pulsante "X" per eliminare la riga
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "X";
            deleteButton.classList.add("delete-row");

            // Posiziona il pulsante fuori dalla tabella
            deleteButton.style.position = "absolute";
            deleteButton.style.right = "10px";

            // Calcola la posizione verticale
            let updateButtonPosition = () => {
                let rowRect = newRow.getBoundingClientRect();
                let containerRect = moduleSection.getBoundingClientRect();
                deleteButton.style.top = (rowRect.top - containerRect.top + rowRect.height / 2) + "px";
                deleteButton.style.transform = "translateY(-50%)";
            };

            // Aggiunge il pulsante al contenitore della tabella
            moduleSection.appendChild(deleteButton);
            updateButtonPosition();

            // Aggiungi evento per eliminare la riga e il pulsante associato
            deleteButton.addEventListener("click", function () {
                newRow.remove();
                deleteButton.remove();
                calcolaTotali();
                updateSpecifico();  // Aggiorna il messaggio Specifico dopo la rimozione
            });

            calcolaTotali();
            updateSpecifico();
        });
    });

    function calcolaTotali() {
        let totaleMensile = 0;
        let totaleUnaTantum = 0;

        document.querySelectorAll(".modulo").forEach(modulo => {
            modulo.querySelectorAll("tbody tr").forEach(row => {
                let prezzoMensile = row.querySelector(".prezzoMensile").value.replace(".", "").replace(",", ".");
                let prezzoUnaTantum = row.querySelector(".prezzoUnaTantum").value.replace(".", "").replace(",", ".");
                let quantita = parseInt(row.querySelector(".quantita").value) || 0;

                totaleMensile += (parseFloat(prezzoMensile) || 0) * quantita;
                totaleUnaTantum += (parseFloat(prezzoUnaTantum) || 0) * quantita;
            });
        });

        // Formatta i totali
        let formattaNumero = new Intl.NumberFormat("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        document.getElementById("totaleMensile").textContent = formattaNumero.format(totaleMensile) + " €";
        document.getElementById("totaleUnaTantum").textContent = formattaNumero.format(totaleUnaTantum) + " €";
    }

    // Aggiungi evento di input per ricalcolare i totali
    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("quantita") ||
            event.target.classList.contains("prezzoMensile") ||
            event.target.classList.contains("prezzoUnaTantum") ||
            event.target.classList.contains("Servizio")        
        ) {
          calcolaTotali();
          updateSpecifico();
        }
      });
      
    // Rimuove la prima riga iniziale se presente
    window.addEventListener('load', function() {
        document.querySelectorAll('.module-table tbody').forEach(tbody => {
          while(tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
        });
      });
      
});


// Data
document.addEventListener("DOMContentLoaded", function () {
    let dataPreventivoInput = document.getElementById("dataPreventivo");
    let validoFinoInput = document.getElementById("validoFino");
    let dataPreventivoSeconda = document.getElementById("dataPreventivoSeconda");
    let validoFinoSeconda = document.getElementById("validoFinoSeconda");
  
    function aggiornaDate() {
      let oggi = new Date();
      let oggiISO = oggi.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  
      // Imposta la data del preventivo solo se non è già stata modificata manualmente
      if (!dataPreventivoInput.value) {
        dataPreventivoInput.value = oggiISO;
      }
  
      // Calcola la data di scadenza (un mese dopo)
      let scadenza = new Date(oggi);
      scadenza.setMonth(scadenza.getMonth() + 1);
      let scadenzaISO = scadenza.toISOString().split("T")[0];
  
      // Imposta la data di scadenza solo se non è già stata modificata manualmente
      if (!validoFinoInput.value) {
        validoFinoInput.value = scadenzaISO;
      }
  
      // Aggiorna la seconda pagina con le date selezionate
      dataPreventivoSeconda.textContent = dataPreventivoInput.value.split("-").reverse().join("/");
      validoFinoSeconda.textContent = validoFinoInput.value.split("-").reverse().join("/");
    }
  
    // Quando si cambia la data del preventivo, aggiorna la scadenza e la seconda pagina
    dataPreventivoInput.addEventListener("change", function () {
      let dataInserita = new Date(dataPreventivoInput.value);
      let scadenza = new Date(dataInserita);
      scadenza.setMonth(scadenza.getMonth() + 1);
      validoFinoInput.value = scadenza.toISOString().split("T")[0];
  
      aggiornaDate();
    });
  
    // Quando si cambia manualmente la data di scadenza, aggiorna solo la seconda pagina
    validoFinoInput.addEventListener("change", aggiornaDate);
  
    // Imposta le date iniziali e aggiorna la seconda pagina
    aggiornaDate();
  });
  
  function sincronizzaClienti() {
    // Prende i valori dalla prima pagina
    const nome = document.getElementById("clientName").value;
    const indirizzo = document.getElementById("clientAddress").value;
    const piva = document.getElementById("clientPiva").value;

    // Li copia nei campi della seconda pagina
    document.getElementById("clientNameSeconda").value = nome;
    document.getElementById("clientAddressSeconda").value = indirizzo;
    document.getElementById("clientPivaSeconda").value = piva;
  }

  // Aggiorna i dati in tempo reale
  document.getElementById("clientName").addEventListener("input", sincronizzaClienti);
  document.getElementById("clientAddress").addEventListener("input", sincronizzaClienti);
  document.getElementById("clientPiva").addEventListener("input", sincronizzaClienti);

  //totali sincronizzati
  function sincronizzaTotali() {
    // Seleziona gli elementi della prima pagina
    const totaleQuotaMensilePrima = document.getElementById("totaleMensile");
    const prezzoUnaTantumPrima = document.getElementById("totaleUnaTantum");

    // Seleziona gli elementi della seconda pagina
    const totaleQuotaMensileSeconda = document.getElementById("totaleQuotaMensileSeconda");
    const prezzoUnaTantumSeconda = document.getElementById("prezzoUnaTantumSeconda");

    // Controlla che gli elementi esistano per evitare errori
    if (totaleQuotaMensilePrima && totaleQuotaMensileSeconda) {
        totaleQuotaMensileSeconda.textContent = totaleQuotaMensilePrima.textContent;
    }

    if (prezzoUnaTantumPrima && prezzoUnaTantumSeconda) {
        prezzoUnaTantumSeconda.textContent = prezzoUnaTantumPrima.textContent;
    }
}

// Assicuriamoci che la sincronizzazione avvenga ogni volta che i totali vengono aggiornati
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("quantita") ||
            event.target.classList.contains("prezzoMensile") ||
            event.target.classList.contains("prezzoUnaTantum")) {
            sincronizzaTotali();
        }
    });

    sincronizzaTotali(); // Sincronizza i totali iniziali
});

document.addEventListener("DOMContentLoaded", function () {
    const numeroPreventivo = document.getElementById("numeroPreventivo");
  
    // Controlla se c'è un valore salvato nel localStorage e lo applica
    const savedNumero = localStorage.getItem("numeroPreventivo");
    if (savedNumero) {
      numeroPreventivo.textContent = savedNumero;
    }
  
    // Salva il numero quando viene modificato
    numeroPreventivo.addEventListener("input", function () {
      localStorage.setItem("numeroPreventivo", numeroPreventivo.textContent);
    });
  });
  

//Esportazione PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("preventivo");
  
    // Recupera il valore aggiornato del numero preventivo
    const numeroPreventivo = document.getElementById("numeroPreventivo").textContent;
    
    // Salva il valore attuale nel localStorage
    localStorage.setItem("numeroPreventivo", numeroPreventivo);
  
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save(`preventivo_${numeroPreventivo}.pdf`);
    });
  }
  

  // numerazione automatica
  document.addEventListener("DOMContentLoaded", function () {
    const numeroPreventivo = document.getElementById("numeroPreventivo");
  
    // Recupera il numero salvato oppure imposta 1 se è la prima volta
    let savedNumero = localStorage.getItem("numeroPreventivo");
    if (!savedNumero) {
      savedNumero = 1; // Se non esiste, parte da 1
    } else {
      savedNumero = parseInt(savedNumero); // Converte in numero
    }
    
    numeroPreventivo.textContent = savedNumero;
  
    // Salva il numero se viene modificato manualmente
    numeroPreventivo.addEventListener("input", function () {
      localStorage.setItem("numeroPreventivo", numeroPreventivo.textContent);
    });
  
    // Quando si genera il PDF, incrementa il numero
    document.getElementById("btnExportPDF").addEventListener("click", function () {
      // Incrementa il numero
      let nuovoNumero = parseInt(numeroPreventivo.textContent) + 1;
      localStorage.setItem("numeroPreventivo", nuovoNumero);
  
      // Aggiorna il testo nella pagina
      numeroPreventivo.textContent = nuovoNumero;
    });
  });
  
//note automatiche
document.addEventListener("DOMContentLoaded", function() {
    const noteTexts = {
      immagine: {
        header: "Note – IMMAGINE",
        contenuti: "Le spese relative alle campagne pubblicitarie a pagamento (ADS) non sono incluse nel preventivo e rimangono a discrezione del cliente. Nel caso in cui i contenuti forniti risultino inadatti o di qualità insufficiente, verranno utilizzate immagini stock professionali.",
        aggiornamenti: "È previsto un incontro mensile dedicato all'aggiornamento della situazione marketing e ai KPI delle piattaforme social.",
        fileTransfer: "È richiesto al cliente l’utilizzo dei sistemi WeTransfer per il trasferimento dei file."
      },
      digitalizzazione: {
        header: "Note – DIGITALIZZAZIONE",
        tempistiche: "La consegna del sito è prevista indicativamente entro il 15 marzo 2025.",
        modifiche: "È inclusa una modifica grafica annuale all’interno del sito/applicazione.",
        fileTransfer: "È richiesto al cliente l’utilizzo dei sistemi WeTransfer per il trasferimento dei file."
      },
      contabilita: {
        header: "Note – CONTABILITÀ",
        costi: "Si precisa che eventuali costi accessori quali bolli, imposte di registro, diritti di segreteria e altre spese funzionali all’espletamento dell’incarico non sono inclusi nel presente preventivo e saranno a carico del cliente. I compensi per eventuali servizi ulteriori saranno concordati in forma scritta in via separata.",
        tempistiche: "È previsto un incontro trimestrale per la revisione della contabilità, la gestione finanziaria e la consulenza dedicata.",
        aggiornamenti: "È prevista una newsletter per gli aggiornamenti di settore o interni a Promethea."
      },
      management: {
        header: "Note – MANAGEMENT",
        contenuti: "Sono escluse da questo preventivo eventuali spese accessorie, concordate con il cliente preventivamente ai fini della consulenza/formazione."
      }
    };
  
    let manualEdit = false; // Se l'utente modifica manualmente, non sovrascrivere
  
    function isModuleActive(moduleTableId) {
        const table = document.getElementById(moduleTableId);
        if (!table) return false;
        const rows = table.querySelectorAll("tbody tr");
        // Se esiste almeno una riga, il modulo è considerato attivo,
        // anche se i valori in essa contenuti sono 0 o vuoti.
        return rows.length > 0;
      }
      
      
      
  
    function generateNotesText() {
      let finalNotes = "";
      let fileTransferIncluded = false;
  
      if (isModuleActive("immagine-table")) {
        finalNotes += `<div class="note-editable" contenteditable="true">
                          <h3>${noteTexts.immagine.header}</h3>
                          <p><strong>Contenuti:</strong> ${noteTexts.immagine.contenuti}</p>
                          <p><strong>Aggiornamenti:</strong> ${noteTexts.immagine.aggiornamenti}</p>
                          <p><strong>File Transfer:</strong> ${noteTexts.immagine.fileTransfer}</p>
                       </div>`;
        fileTransferIncluded = true;
      }
      if (isModuleActive("digitalizzazione-table")) {
        finalNotes += `<div class="note-editable" contenteditable="true">
                          <h3>${noteTexts.digitalizzazione.header}</h3>
                          <p><strong>Tempistiche:</strong> ${noteTexts.digitalizzazione.tempistiche}</p>
                          <p><strong>Modifiche Grafiche:</strong> ${noteTexts.digitalizzazione.modifiche}</p>`;
        if (!fileTransferIncluded) {
          finalNotes += `<p><strong>File Transfer:</strong> ${noteTexts.digitalizzazione.fileTransfer}</p>`;
          fileTransferIncluded = true;
        }
        finalNotes += `</div>`;
      }
      if (isModuleActive("contabilita-table")) {
        finalNotes += `<div class="note-editable" contenteditable="true">
                          <h3>${noteTexts.contabilita.header}</h3>
                          <p><strong>Costi Accessori:</strong> ${noteTexts.contabilita.costi}</p>
                          <p><strong>Tempistiche:</strong> ${noteTexts.contabilita.tempistiche}</p>
                          <p><strong>Aggiornamenti:</strong> ${noteTexts.contabilita.aggiornamenti}</p>
                       </div>`;
      }
      if (isModuleActive("management-table")) {
        finalNotes += `<div class="note-editable" contenteditable="true">
                          <h3>${noteTexts.management.header}</h3>
                          <p><strong>Contenuti:</strong> ${noteTexts.management.contenuti}</p>
                       </div>`;
      }
      return finalNotes;
    }
  
    function updateNotes() {
      if (manualEdit) return; // Se l'utente ha modificato le note, non aggiornarle automaticamente
      const noteContainer = document.getElementById("notePreventivo");
      if (!noteContainer) return;
      const notesHTML = generateNotesText();
      noteContainer.innerHTML = notesHTML;
    }
  
    // Aggiungi observer per ogni modulo
    const moduleIds = ["immagine-table", "digitalizzazione-table", "contabilita-table", "management-table"];
    moduleIds.forEach(function(moduleId) {
      const table = document.getElementById(moduleId);
      if (table) {
        const tbody = table.querySelector("tbody");
        if (tbody) {
          const observer = new MutationObserver(updateNotes);
          observer.observe(tbody, { childList: true, subtree: true, characterData: true });
        }
      }
    });
  
    updateNotes();
  });
  

// Funzione che verifica se un modulo è attivo: consideriamo attivo il modulo se nel corpo della tabella è presente almeno una riga.
function isModuleActive(moduleTableId) {
    const table = document.getElementById(moduleTableId);
    if (!table) return false;
    const rows = table.querySelectorAll("tbody tr");
    return rows.length > 0;
  }
  
  // Specifico automatico (versione definitiva)
  function updateSpecifico() {
    const specificoDiv = document.querySelector(".Specifico");
    if (!specificoDiv) {
      console.error("Elemento .Specifico non trovato!");
      return;
    }
    console.log("updateSpecifico chiamata");
  
    // Messaggio base che deve sempre comparire, anche se nessun modulo è attivo
    const baseMessage = "IL PREVENTIVO IN OGGETTO RAPPRESENTA IL COSTO TOTALE DI:";
    let parts = [];
  
    // Aggiungi i testi specifici se il modulo ha almeno una riga (anche se i valori sono 0)
    if (isModuleActive("immagine-table")) {
      parts.push("UNA GESTIONE DEL PROFILO SOCIAL (INSTAGRAM E FACEBOOK)");
    }
    if (isModuleActive("digitalizzazione-table")) {
      parts.push("UN SITO WEB/APPLICAZIONE");
    }
    if (isModuleActive("contabilita-table")) {
      parts.push("UNA GESTIONE CONTABILE E FISCALE");
    }
    if (isModuleActive("management-table")) {
      parts.push("UNA FORMAZIONE/ANALISI AZIENDALE");
    }
  
    // Costruisce il messaggio finale: se parts è vuoto, visualizza solo il baseMessage
    let finalMessage = baseMessage;
    if (parts.length > 0) {
      finalMessage += " " + parts.join(", ");
    }
  
    specificoDiv.textContent = finalMessage;
    console.log("updateSpecifico eseguito:", finalMessage);
  }
  
  // Chiama updateSpecifico() una sola volta quando il DOM è completamente caricato.
  document.addEventListener("DOMContentLoaded", function() {
    updateSpecifico();
  });
  