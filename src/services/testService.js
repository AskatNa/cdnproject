const LatencyResult = require("../models/latencyResult");
const realPing = require("../utils/realPing");
const pingAllPOPs = require("../utils/pingPOP");

exports.runTest = async (domain) => {
    const results = [];

    // 1. Local real latency test
    const local = await realPing(domain);

    await LatencyResult.create({
        domain,
        region: "Local-Machine",
        latency: local.total
    });

    results.push({ region: "Local-Machine", latency: local.total });

    // 2. CDN PoPs
    const pops = await pingAllPOPs();

    for (let pop of pops) {
        await LatencyResult.create({
            domain,
            region: pop.region,
            latency: pop.latency ?? null,
        });

        results.push({
            region: pop.region,
            latency: pop.latency ?? null
        });
    }

    return {
        domain,
        results,
        bestRoute: results.filter(r => r.latency !== null).sort((a, b) => a.latency - b.latency)[0]
    };
};
