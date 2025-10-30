const LatencyResult = require("../models/latencyResult");
const ping = require("../utils/ping");

exports.runTest = async (domain) => {
    const regions = ["Europe", "USA", "Asia", "Australia"];

    const results = [];

    for (let region of regions) {
        const latency = await ping(domain);

        const record = await LatencyResult.create({
            domain,
            region,
            latency
        });

        results.push(record);
    }

    return results;
};
