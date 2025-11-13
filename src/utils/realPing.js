const dns = require("dns").promises;
const net = require("net");
const ping = require("ping");
const axios = require("axios");

async function tcpPing(host, port = 443, timeout = 1500) {
    return new Promise((resolve) => {
        const start = Date.now();
        const socket = new net.Socket();
        socket.setTimeout(timeout);

        socket.once("connect", () => {
            const latency = Date.now() - start;
            socket.destroy();
            resolve(latency);
        });

        socket.once("timeout", () => {
            socket.destroy();
            resolve(null);
        });

        socket.once("error", () => resolve(null));

        socket.connect(port, host);
    });
}

async function httpFallback(domain) {
    const start = Date.now();
    try {
        await axios.head("https://" + domain, { timeout: 1500 });
        return Date.now() - start;
    } catch {
        return null;
    }
}

async function realPing(domain) {
    try {
        let ip;
        try {
            const addresses = await dns.resolve(domain);
            ip = addresses[0];
        } catch {
            ip = null;
        }

        const icmp = ip ? await ping.promise.probe(ip) : { alive: false, time: "unknown" };
        const tcp = ip ? await tcpPing(ip) : null;

        let finalLatency;
        if (icmp.time !== "unknown") finalLatency = Number(icmp.time);
        else if (tcp !== null) finalLatency = tcp;
        else finalLatency = await httpFallback(domain);

        return {
            domain,
            ip,
            total: finalLatency,
            icmp_latency_ms: icmp.time === "unknown" ? null : Number(icmp.time),
            tcp_latency_ms: tcp,
            reachable: !!finalLatency
        };
    } catch (err) {
        return { domain, error: err.message };
    }
}

module.exports = realPing;
