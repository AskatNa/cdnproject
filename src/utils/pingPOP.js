const axios = require("axios");

const POP_SERVERS = [
    { region: "US Worker", url: "https://cdn-us-worker.qpert345.workers.dev?target=" },
    { region: "EU Worker", url: "https://cdn-eu-worker.qpert345.workers.dev?target=" },
    { region: "Asia Worker", url: "https://cdn-asia-worker.qpert345.workers.dev?target=" }
];

async function pingPOP(regionObj, domain) {
    try {
        const start = Date.now();
        const res = await axios.get(regionObj.url + domain);
        const latency = res.data.latency ?? (Date.now() - start);

        return {
            region: regionObj.region,
            colo: res.data.colo || "Unknown",
            latency
        };
    } catch (err) {
        return {
            region: regionObj.region,
            latency: null,
            error: err.message
        };
    }
}

async function pingAllPOPs(domain) {
    const promises = POP_SERVERS.map(pop => pingPOP(pop, domain));
    return Promise.all(promises);
}

module.exports = pingAllPOPs;
