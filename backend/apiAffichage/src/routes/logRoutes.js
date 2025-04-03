const express = require("express");
const { getLogs, getLog } = require("../controllers/logController");

const router = express.Router();

router.get("/", getLogs);
router.get("/info", getLog);

module.exports = router;