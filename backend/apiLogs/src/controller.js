const dotenv = require("dotenv").config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiRecupLog = process.env.API_URL_LOG;
const apiConversion = process.env.API_CONVERSION;
const cheminSauvegarde = path.join(__dirname, process.env.CHEMIN_FICHIER_RECUP);

async function getAll(req, res) {
    try {
        const response = await axios.get(apiRecupLog, { responseType: 'arraybuffer' });

        // Vérifier si le dossier existe, sinon le créer
        fs.mkdirSync(path.dirname(cheminSauvegarde), { recursive: true });

        fs.writeFileSync(cheminSauvegarde, response.data);

        const convertion = await axios.get(apiConversion, { responseType: 'arraybuffer' });
        console.log(convertion.status);
        if (convertion.status !== 200) {
            return res.status(500).json({ message: "Erreur lors de la conversion du fichier" });
        }

        res.status(200).json({ message: "Fichier PCAP téléchargé et converti avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors du téléchargement des logs" });
    }
}

module.exports = { getAll };