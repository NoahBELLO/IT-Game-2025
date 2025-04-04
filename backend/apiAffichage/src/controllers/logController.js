const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

async function getLogs(req, res) {
    const filePath = path.join(__dirname, '../../../csv', 'alertes.csv');

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

async function getLogsCount(req, res) {
    const filePath = path.join(__dirname, '../../../csv', 'logs_analyse_top_ips_info.csv');

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

async function getLog(req, res) {
    const ipAdress = req.query;
    res.status(200).json(ipAdress);
    // const filePath = path.join(__dirname, '../../../csv', 'logs.csv');

    // const readStream = fs.createReadStream(filePath);

    // const jsonData = [];

    // csv({ delimiter: ',' })
    //     .fromStream(readStream)
    //     .on('data', (data) => {
    //         try {
    //             const jsonLine = JSON.parse(data.toString('utf8'));
    //             jsonData.push(jsonLine);
    //         } catch (err) {
    //             console.error('Erreur lors du parsing d\'une ligne:', err);
    //         }
    //     })
    //     .on('end', () => {
    //         res.json(jsonData);
    //     })
    //     .on('error', (error) => {
    //         console.error('Erreur lors du parsing du CSV:', error);
    //         res.status(500).send('Erreur lors de la conversion du fichier CSV.');
    //     });
}

module.exports = { getLogs, getLog, getLogsCount };