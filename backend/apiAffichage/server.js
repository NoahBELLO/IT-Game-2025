const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logRoutes = require("./routes/logRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/logs", logRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error("❌ Erreur :", err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 API en cours d'exécution sur http://localhost:${port}`);
});
