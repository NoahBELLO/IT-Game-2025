const dotenv = require("dotenv").config();
const axios = require('axios');
const { response } = require("express");
const fs = require('fs');
const path = require('path');

const apiRecupLog = process.env.API_URL_LOG;
const apiLocalisation = process.env.API_LOCALISATION;
const apiKey = process.env.API_KEY;
const cheminSauvegarde = path.join(__dirname, process.env.CHEMIN_FICHIER_RECUP);

async function getAll(req, res) {
    try {
        const response = await axios.get(apiRecupLog, { responseType: 'arraybuffer' });

        fs.mkdirSync(path.dirname(cheminSauvegarde), { recursive: true });

        fs.writeFileSync(cheminSauvegarde, response.data);

        res.status(200).json({ message: "Fichier PCAP téléchargé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors du téléchargement des logs" });
    }
}

async function getAllLocalisation(req, res) {
    try {
        const { ips } = req.body;
        if (!ips || !Array.isArray(ips) || ips.length === 0) {
            return res.status(400).json({ message: "Liste d'IP invalide" });
        }

        const results = await Promise.all(
            ips.map(async (ip) => {
                try {
                    const response = await axios.get(`${apiLocalisation}?apiKey=${apiKey}&ip=${ip}`);
                    const data = response.data;

                    return {
                        ip: data.ip,
                        country: data.country_name,
                        city: data.city,
                        latitude: data.latitude,
                        longitude: data.longitude
                    };
                } catch (err) {
                    console.error(`Erreur lors de la récupération de la localisation pour ${ip}`);
                    return { ip, error: "Impossible de récupérer la localisation" };
                }
            })
        );

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des localisations" });
    }
}

module.exports = { getAll, getAllLocalisation };