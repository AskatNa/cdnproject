// utils/pingPOP.js
const axios = require("axios");

const POP_SERVERS = [
    { region: "US Worker", url: "https://cdn-us-worker.qpert345.workers.dev?target=", coords: [37.0902, -95.7129] },
    { region: "EU Worker", url: "https://cdn-eu-worker.qpert345.workers.dev?target=", coords: [50.1109, 8.6821] },
    { region: "Asia Worker", url: "https://cdn-asia-worker.qpert345.workers.dev?target=", coords: [22.3193, 114.1694] },
    { region: "Japan", url: "https://cdn-japan-worker.qpert345.workers.dev/?target=", coords: [35.6762, 139.6503] },
    { region: "UAE", url: "https://cdn-uae-worker.qpert345.workers.dev/?target=", coords: [25.276987, 55.296249] },
    { region: "Brazil", url: "https://cdn-brazil-worker.qpert345.workers.dev/?target=", coords: [-23.5505, -46.6333] }
];

// Пингуем один POP с таймаутом
async function pingPOP(regionObj, domain) {
    try {
        const start = Date.now();
        const res = await axios.get(regionObj.url + domain, { timeout: 4000 }); // таймаут 3 сек
        const latency = res.data.latency ?? (Date.now() - start);

        return {
            region: regionObj.region,
            coords: regionObj.coords,
            colo: res.data.colo || "Unknown",
            latency

        };
    } catch (err) {
        return {
            region: regionObj.region,
            coords: regionObj.coords,
            latency: null,
            error: err.message
        };
    }
}

// Пингуем все POP параллельно
async function pingAllPOPs(domain) {
    const promises = POP_SERVERS.map(pop => pingPOP(pop, domain));
    return Promise.all(promises);
}

module.exports = pingAllPOPs;
module.exports.POP_SERVERS = POP_SERVERS; // для фронта
