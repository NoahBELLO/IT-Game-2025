const express = require("express");
const { getAll } = require("./controller");

const router = express.Router();

router.get("/recuperation", getAll);

module.exports = router;