// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = "TuContraseñaSecreta"; // Cambia esto a tu contraseña
const DB_FILE = path.join(__dirname, "db.json");

app.use(express.json());
app.use(cors());

// Cargar votos desde el archivo
function loadVotes() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch {
        return {};
    }
}

// Guardar votos en el archivo
function saveVotes(votes) {
    fs.writeFileSync(DB_FILE, JSON.stringify(votes, null, 2));
}

// Obtener votos
app.get("/votes", (req, res) => {
    const votes = loadVotes();
    res.json(votes);
});

// Incrementar votos
app.post("/vote", (req, res) => {
    const { photo } = req.body;
    if (!photo) return res.status(400).json({ error: "Falta el nombre de la foto." });

    const votes = loadVotes();
    votes[photo] = (votes[photo] || 0) + 1;
    saveVotes(votes);

    res.json({ success: true, votes: votes[photo] });
});

// Resetear votos
app.post("/reset", (req, res) => {
    const { password } = req.body;
    if (password !== PASSWORD) {
        return res.status(403).json({ error: "Contraseña incorrecta." });
    }

    saveVotes({});
    res.json({ success: true, message: "Votos reseteados correctamente." });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
