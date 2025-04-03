const express = require("express");
const dotenv = require("dotenv").config();
const route = require("./src/routes");

const app = express();
const port = process.env.API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/logs", route);

app.use((err, req, res, next) => {
    console.error("Erreur :", err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
});

app.listen(port, () => {
    console.log(`API en cours d'exécution sur le port ${port}`);
});
