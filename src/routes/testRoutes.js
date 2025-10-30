const express = require("express");
const { runLatencyTest, getAllResults, getStats } = require("../controllers/testController");

const router = express.Router();

router.post("/run", runLatencyTest);
router.get("/", getAllResults);
router.get("/stats", getStats);

module.exports = router;
