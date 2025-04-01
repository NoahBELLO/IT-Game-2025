const { MongoClient, ServerApiVersion } = require('mongodb');
const dotvenv = require('dotenv').config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connexion réussie à MongoDB");
        return client.db("ITGame");
    } catch (err) {
        console.error("Erreur de connexion à MongoDB:", err);
        process.exit(1);
    }
}

module.exports = connectDB;