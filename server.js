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
        if (err) return res.status(500).json({ error: err });
        res.json(JSON.parse(data));
    });
});

// API per aggiornare il numero progressivo
app.post("/incrementa", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: err });

        let jsonData = JSON.parse(data);
        jsonData.numeroPreventivo++;

        fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json(jsonData);
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
