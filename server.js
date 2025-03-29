const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const filePath = "numero.json";

// API per ottenere il numero attuale
app.get("/numero", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Errore nella lettura del file" });

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (error) {
            res.status(500).json({ error: "Errore nel parsing del file JSON" });
        }
    });
});

// API per incrementare il numero progressivo
app.post("/incrementa", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Errore nella lettura del file" });

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({ error: "Errore nel parsing del file JSON" });
        }

        jsonData.numeroPreventivo++;

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Errore nella scrittura del file" });
            res.json(jsonData);
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server avviato su http://localhost:${PORT}`));