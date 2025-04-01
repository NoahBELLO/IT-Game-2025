const express = require("express");
const dotenv = require("dotenv").config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const apiRecupLog = process.env.API_URL_LOG;
const cheminSauvegarde = path.join(__dirname, process.env.CHEMIN_FICHIER_RECUP);
const port = process.env.API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function run() {
    try {
        app.use('/recuperation', async (req, res) => {
            try {
                const response = await axios.get(apiRecupLog, { responseType: 'arraybuffer' });

                // Vérifier si le dossier existe, sinon le créer
                fs.mkdirSync(path.dirname(cheminSauvegarde), { recursive: true });

                fs.writeFileSync(cheminSauvegarde, response.data);
                res.status(200).json({ message: "Fichier PCAP téléchargé avec succès" });
            } catch (err) {
                res.status(500).json({ message: "Erreur lors du téléchargement des logs" });
            }
        });

        // Middleware pour gérer les erreurs 500 (erreurs serveur)
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: "Erreur interne du serveur" });
        });

        // Démarrer le serveur
        app.listen(port, () => {
            console.log(`API en cours d'exécution sur le port ${port}`);
        });

    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);