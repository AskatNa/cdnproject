const axios = require("axios");

const POP_SERVERS = [
    { region: "USA", url: "http://localhost:9001/ping" },
    { region: "EU", url: "http://localhost:9002/ping" },
    { region: "Asia", url: "http://localhost:9003/ping" },
];

async function pingPOP(regionObj) {
    try {
        const start = Date.now();
        const res = await axios.get(regionObj.url);
        const latency = Date.now() - start;

        return {
            region: res.data.region,
            latency,
            popReported: res.data.latency
        };
    } catch (err) {
        return {
            region: regionObj.region,
            latency: null,
            error: err.message
        };
    }
}

async function pingAllPOPs() {
    const promises = POP_SERVERS.map(pop => pingPOP(pop));
    return Promise.all(promises);
}

module.exports = pingAllPOPs;
