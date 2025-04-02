const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

async function getLogs(req, res) {
    const filePath = path.join(__dirname, '../../../csv', 'top_ips_enrichies.csv');

    const readStream = fs.createReadStream(filePath);

    const jsonData = [];

    csv({ delimiter: ',' })
        .fromStream(readStream)
        .on('data', (data) => {
            try {
                const jsonLine = JSON.parse(data.toString('utf8'));
                jsonData.push(jsonLine);
            } catch (err) {
                console.error('Erreur lors du parsing d\'une ligne:', err);
            }
        })
        .on('end', () => {
            res.json(jsonData);
        })
        .on('error', (error) => {
            console.error('Erreur lors du parsing du CSV:', error);
            res.status(500).send('Erreur lors de la conversion du fichier CSV.');
        });
}

module.exports = { getLogs };