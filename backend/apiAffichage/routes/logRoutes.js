const express = require("express");
const { getLogs } = require("../controllers/logController");

const router = express.Router();

router.get("/", getLogs); // Route GET pour récupérer les logs

module.exports = router;
