const LatencyResult = require("../models/latencyResult");
const realPing = require("../utils/realPing");
const pingAllPOPs = require("../utils/pingPOP");

exports.runTest = async (domain) => {
    const results = [];

    const local = await realPing(domain);
    await LatencyResult.create({
        domain,
        region: "Local-Machine",
        latency: local.total
    });
    results.push({ region: "Local-Machine", latency: local.total });

    const pops = await pingAllPOPs(domain);

    for (let pop of pops) {
        await LatencyResult.create({
            domain,
            region: pop.region,
            latency: pop.latency ?? null
        });

        results.push({
            region: pop.region,
            latency: pop.latency ?? null
        });
    }

    const bestRoute = results
        .filter(r => r.latency !== null)
        .sort((a, b) => a.latency - b.latency)[0];

    return { domain, results, bestRoute };
};
