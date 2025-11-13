const axios = require("axios");

const POP_SERVERS = [
    { region: "US Worker", url: "https://cdn-us-worker.qpert345.workers.dev?target=", coords: [37.0902, -95.7129] },
    { region: "EU Worker", url: "https://cdn-eu-worker.qpert345.workers.dev?target=", coords: [50.1109, 8.6821] },
    { region: "Asia Worker", url: "https://cdn-asia-worker.qpert345.workers.dev?target=", coords: [22.3193, 114.1694] },
    { region: "Japan", url: "https://cdn-japan-worker.qpert345.workers.dev?target=", coords: [35.6762, 139.6503] },
    { region: "UAE", url: "https://cdn-uae-worker.qpert345.workers.dev?target=", coords: [25.276987, 55.296249] },
    { region: "Brazil", url: "https://cdn-brazil-worker.qpert345.workers.dev?target=", coords: [-23.5505, -46.6333] }
];

function calculateJitter(latencies) {
    if (!latencies.length) return 0;
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const variance = latencies.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / latencies.length;
    return Math.sqrt(variance);
}

async function pingPOP(regionObj, domain, attempts = 3) {
    const latencies = [];
    let ttfb = null;
    let colo = "Unknown";

    for (let i = 0; i < attempts; i++) {
        try {
            const start = Date.now();
            const res = await axios.get(regionObj.url + domain, { timeout: 5000 });
            const end = Date.now();

            const singleLatency =
                typeof res.data.latency === "number" && res.data.latency > 0
                    ? Math.round(res.data.latency)
                    : end - start;

            latencies.push(singleLatency);

            if (i === 0) {
                ttfb =
                    typeof res.data.ttfb === "number" && res.data.ttfb > 0
                        ? Math.round(res.data.ttfb)
                        : singleLatency;
                colo = res.data.colo || "Unknown";
            }
        } catch {
            latencies.push(null);
        }
    }

    const validLatencies = latencies.filter(l => typeof l === "number");
    const avgLatency = validLatencies.length
        ? Math.round(validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length)
        : null;

    const jitter = validLatencies.length ? Math.round(calculateJitter(validLatencies)) : null;

    return {
        region: regionObj.region,
        coords: regionObj.coords,
        colo,
        latency: avgLatency,
        ttfb,
        jitter,
    };
}


async function pingAllPOPs(domain) {
    const promises = POP_SERVERS.map(pop => pingPOP(pop, domain));
    const results = await Promise.all(promises);

    const valid = results.filter(r => r.latency !== null);
    const avgLatency = valid.length ? Math.round(valid.reduce((a,b)=>a+b.latency,0)/valid.length) : null;
    const avgTTFB = valid.length ? Math.round(valid.reduce((a,b)=>a+b.ttfb,0)/valid.length) : null;
    const avgJitter = valid.length ? Math.round(valid.reduce((a,b)=>a+b.jitter,0)/valid.length) : null;

    return {
        domain,
        average: { latency: avgLatency, ttfb: avgTTFB, jitter: avgJitter },
        results
    };
}

module.exports = pingAllPOPs;
module.exports.POP_SERVERS = POP_SERVERS;
