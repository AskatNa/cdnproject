// services/testService.js
const pingAllPOPs = require("../utils/pingPOP");

const COLORS = {
    low: "#3AA55B",
    medium: "#EDBD21",
    high: "#EA5B2B",
    neutral: "#B3B3B3"
};

function isValidDomain(domain) {
    const regex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
    return regex.test(domain);
}

function getColorByLatency(latency) {
    if (latency == null) return COLORS.neutral;
    if (latency < 100) return COLORS.low;
    if (latency < 250) return COLORS.medium;
    return COLORS.high;
}

exports.runTest = async (domain, region = "Global") => {
    if (!isValidDomain(domain)) {
        throw new Error("Invalid domain format");
    }

    const popsData = await pingAllPOPs(domain);

    const filteredPOPs = region === "Global"
        ? popsData.results
        : popsData.results.filter(p => p.region.toLowerCase().includes(region.toLowerCase()));

    const results = filteredPOPs.map(p => ({
        region: p.region,
        latency: p.latency ?? null,
        ttfb: p.ttfb ?? null,
        jitter: p.jitter ?? null,
        coords: p.coords,
        color: getColorByLatency(p.latency)
    }));

    const valid = results.filter(r => typeof r.latency === "number" && r.latency > 0);
    const avgLatency = valid.length
        ? Number((valid.reduce((sum, r) => sum + r.latency, 0) / valid.length).toFixed(2))
        : null;

    const bestRoute = valid.length
        ? valid.reduce((a, b) => (a.latency < b.latency ? a : b))
        : null;

    return {
        domain,
        results,
        bestRoute: bestRoute ? { ...bestRoute, color: getColorByLatency(bestRoute.latency) } : null,
        avgLatency,
        avgColor: getColorByLatency(avgLatency)
    };
};
