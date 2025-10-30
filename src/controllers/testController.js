const testService = require("../services/testService");

exports.runLatencyTest = async (req, res) => {
    try {
        const { domain } = req.body;
        const results = await testService.runTest(domain);
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
