const express = require("express");
const { runLatencyTest } = require("../controllers/testController");

const router = express.Router();

router.post("/run", runLatencyTest);

module.exports = router;
