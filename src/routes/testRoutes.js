const express = require("express");
const { runLatencyTest, getAllResults, getStats, getPOPs } = require("../controllers/testController");

const router = express.Router();

router.post("/run", runLatencyTest);
router.get("/", getAllResults);
router.get("/stats", getStats);
router.get("/pops", getPOPs);

module.exports = router;
