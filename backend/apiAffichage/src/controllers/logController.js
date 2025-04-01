const connectDB = require("../config/db");

async function getLogs(req, res) {
    try {
        const db = await connectDB();
        const logs = await db.collection("LogsFiltrer").find({}).toArray();
        console.log(" Logs récupérés :", logs);
        res.status(200).json(logs);
    } catch (err) {
        console.error(" Erreur lors de la récupération des logs :", err);
        res.status(500).json({ message: "Erreur de récupération des logs" });
    }
}

module.exports = { getLogs };