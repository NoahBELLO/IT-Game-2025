const express = require("express");
const { getLogs, getLog, getLogsCount } = require("../controllers/logController");

const router = express.Router();

router.get("/", getLogs);
router.get("/count", getLogsCount);
router.get("/info", getLog);

module.exports = router;