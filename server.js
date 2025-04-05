// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Abilita CORS per le richieste dal frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

// Carica il numero iniziale dal file
let numeroPreventivo = loadNumber();

function loadNumber() {
    try {
        const data = fs.readFileSync('numero.json');
        return JSON.parse(data).numeroPreventivo;
    } catch (error) {
        console.error('Errore caricamento numero, inizializzo a 1');
        return 1;
    }
}

// Endpoint per ottenere il numero corrente
app.get('/numero', (req, res) => {
    res.json({ numeroPreventivo });
});

// Endpoint per incrementare il numero
app.post('/incrementa', (req, res) => {
    numeroPreventivo++;
    fs.writeFileSync('numero.json', JSON.stringify({ numeroPreventivo }));
    res.json({ numeroPreventivo });
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});