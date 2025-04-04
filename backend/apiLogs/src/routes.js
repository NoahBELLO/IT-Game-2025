const express = require("express");
const { getAll, getAllLocalisation } = require("./controller");

const router = express.Router();

router.get("/recuperation", getAll);
router.post("/localisation", getAllLocalisation);

module.exports = router;