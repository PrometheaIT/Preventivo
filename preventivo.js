document.addEventListener("DOMContentLoaded", function () {
    // Funzioni Utili
    function isModuleActive(moduleTableId) {
        const table = document.getElementById(moduleTableId);
        if (!table) return false;
        const rows = table.querySelectorAll("tbody tr");
        return rows.length > 0;
    }

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

        let formattaNumero = new Intl.NumberFormat("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        document.getElementById("totaleMensile").textContent = formattaNumero.format(totaleMensile) + " €";
        document.getElementById("totaleUnaTantum").textContent = formattaNumero.format(totaleUnaTantum) + " €";
    }

    function aggiornaDate() {
        let oggi = new Date();
        let oggiISO = oggi.toISOString().split("T")[0];

        if (!dataPreventivoInput.value) {
            dataPreventivoInput.value = oggiISO;
        }

        let scadenza = new Date(oggi);
        scadenza.setMonth(scadenza.getMonth() + 1);
        let scadenzaISO = scadenza.toISOString().split("T")[0];

        if (!validoFinoInput.value) {
            validoFinoInput.value = scadenzaISO;
        }

        dataPreventivoSeconda.textContent = dataPreventivoInput.value.split("-").reverse().join("/");
        validoFinoSeconda.textContent = validoFinoInput.value.split("-").reverse().join("/");
    }

    function sincronizzaClienti() {
        const nome = document.getElementById("clientName").value;
        const indirizzo = document.getElementById("clientAddress").value;
        const piva = document.getElementById("clientPiva").value;

        document.getElementById("clientNameSeconda").value = nome;
        document.getElementById("clientAddressSeconda").value = indirizzo;
        document.getElementById("clientPivaSeconda").value = piva;
    }

    function sincronizzaTotali() {
        const totaleQuotaMensilePrima = document.getElementById("totaleMensile");
        const prezzoUnaTantumPrima = document.getElementById("totaleUnaTantum");

        const totaleQuotaMensileSeconda = document.getElementById("totaleQuotaMensileSeconda");
        const prezzoUnaTantumSeconda = document.getElementById("prezzoUnaTantumSeconda");

        if (totaleQuotaMensilePrima && totaleQuotaMensileSeconda) {
            totaleQuotaMensileSeconda.textContent = totaleQuotaMensilePrima.textContent;
        }

        if (prezzoUnaTantumPrima && prezzoUnaTantumSeconda) {
            prezzoUnaTantumSeconda.textContent = prezzoUnaTantumPrima.textContent;
        }
    }

    function aggiornaNumerazione(numero) {
        numeroPreventivo.textContent = numero;
        localStorage.setItem("numeroPreventivo", numero);
        secondario.textContent = numero;
    }

    function caricaNumerazione() {
        fetch("https://preventivo-backend.onrender.com/numero")
            .then(response => response.json())
            .then(data => aggiornaNumerazione(data.numeroPreventivo))
            .catch(error => console.error("Errore:", error));
    }

    function incrementaNumerazione() {
        fetch("https://preventivo-backend.onrender.com/incrementa", { method: "POST" })
            .then(response => response.json())
            .then(data => aggiornaNumerazione(data.numeroPreventivo))
            .catch(error => console.error("Errore:", error));
    }

    function updateSpecifico() {
        const specificoDiv = document.querySelector(".Specifico");
        if (!specificoDiv) {
            console.error("Elemento .Specifico non trovato!");
            return;
        }

        const baseMessage = "IL PREVENTIVO IN OGGETTO RAPPRESENTA IL COSTO TOTALE DI:";
        let parts = [];

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

        let finalMessage = baseMessage;
        if (parts.length > 0) {
            finalMessage += " " + parts.join(", ");
        }

        specificoDiv.textContent = finalMessage;
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
        if (manualEdit) return;
        const noteContainer = document.getElementById("notePreventivo");
        if (!noteContainer) return;
        const notesHTML = generateNotesText();
        noteContainer.innerHTML = notesHTML;
    }

    // Eventi e Inizializzazioni
    document.querySelectorAll(".add-row").forEach(button => {
        button.addEventListener("click", function () {
            let moduleSection = this.parentElement;
            let tableBody = moduleSection.querySelector(".module-table tbody");

            let newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" class="Servizio"></td>
                <td><input type="number" class="quantita" value="1" min="1"></td>
                <td><input type="text" class="prezzoMensile" value="0"></td>
                <td><input type="text" class="prezzoUnaTantum" value="0"></td>
            `;

            tableBody.appendChild(newRow);

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

            let deleteButton = document.createElement("button");
            deleteButton.innerText = "X";
            deleteButton.classList.add("delete-row");
            deleteButton.style.position = "absolute";
            deleteButton.style.right = "10px";

            let updateButtonPosition = () => {
                let rowRect = newRow.getBoundingClientRect();
                let containerRect = moduleSection.getBoundingClientRect();
                deleteButton.style.top = (rowRect.top - containerRect.top + rowRect.height / 2) + "px";
                deleteButton.style.transform = "translateY(-50%)";
            };

            moduleSection.appendChild(deleteButton);
            updateButtonPosition();

            deleteButton.addEventListener("click", function () {
                newRow.remove();
                deleteButton.remove();
                calcolaTotali();
                updateSpecifico();
            });

            calcolaTotali();
            updateSpecifico();
        });
    });

    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("quantita") ||
            event.target.classList.contains("prezzoMensile") ||
            event.target.classList.contains("prezzoUnaTantum") ||
            event.target.classList.contains("Servizio")) {
            calcolaTotali();
            updateSpecifico();
        }
    });

    window.addEventListener('load', function() {
        document.querySelectorAll('.module-table tbody').forEach(tbody => {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
        });
    });

    const dataPreventivoInput = document.getElementById("dataPreventivo");
    const validoFinoInput = document.getElementById("validoFino");
    const dataPreventivoSeconda = document.getElementById("dataPreventivoSeconda");
    const validoFinoSeconda = document.getElementById("validoFinoSeconda");

    dataPreventivoInput.addEventListener("change", function () {
        let dataInserita = new Date(dataPreventivoInput.value);
        let scadenza = new Date(dataInserita);
        scadenza.setMonth(scadenza.getMonth() + 1);
        validoFinoInput.value = scadenza.toISOString().split("T")[0];

        aggiornaDate();
    });

    validoFinoInput.addEventListener("change", aggiornaDate);

    aggiornaDate();

    document.getElementById("clientName").addEventListener("input", sincronizzaClienti);
    document.getElementById("clientAddress").addEventListener("input", sincronizzaClienti);
    document.getElementById("clientPiva").addEventListener("input", sincronizzaClienti);

    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("quantita") ||
            event.target.classList.contains("prezzoMensile") ||
            event.target.classList.contains("prezzoUnaTantum")) {
            sincronizzaTotali();
        }
    });

    sincronizzaTotali();

    const numeroPreventivo = document.getElementById("numeroPreventivo");
    const exportButton = document.getElementById("exportPDF");
    const secondario = document.getElementById("numeroPreventivoSecondario");

    const observer = new MutationObserver((mutations) => {
        secondario.textContent = mutations[0].target.textContent;
    });

    if (numeroPreventivo) {
        observer.observe(numeroPreventivo, {
            characterData: true,
            childList: true,
            subtree: true
        });
    }

    exportButton.addEventListener("click", incrementaNumerazione);

    caricaNumerazione();

    numeroPreventivo.addEventListener("input", () => {
        secondario.textContent = numeroPreventivo.textContent;
    });

    const noteTexts = {
        immagine: {
            header: "Note – IMMAGINE",
            contenuti: "Le spese relative alle campagne pubblicitarie a pagamento (ADS) non sono incluse nel preventivo e rimangono a discrezione del cliente. Nel caso in cui i contenuti forniti risultino inadatti o di qualità insufficiente, verranno utilizzate immagini stock professionali.",
            aggiornamenti: "È previsto un incontro mensile dedicato all'aggiornamento della situazione marketing e ai KPI delle piattaforme social.",
            fileTransfer: "È richiesto al cliente l’utilizzo dei sistemi WeTransfer per il trasferimento dei file."
        },
        digitalizzazione: {
            header: "Note – DIGITALIZZAZIONE",
            tempistiche: "La consegna del sito è prevista indicativamente entro il " + `<input type="date" id="dataConsegna" name="dataConsegna">`,
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

    let manualEdit = false;

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
    
    updateSpecifico();
    sincronizzaNumeriPreventivo();
});