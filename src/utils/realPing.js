const dns = require("dns").promises;
const net = require("net");
const ping = require("ping");

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

        socket.once("error", () => {
            resolve(null);
        });

        socket.connect(port, host);
    });
}

async function realPing(domain) {
    try {
        const addresses = await dns.resolve(domain);
        const ip = addresses[0];

        const icmp = await ping.promise.probe(ip);
        const tcp = await tcpPing(ip);

        return {
            domain,
            ip,
            total: icmp.time === "unknown" ? tcp : Number(icmp.time),
            icmp_latency_ms: icmp.time === "unknown" ? null : Number(icmp.time),
            tcp_latency_ms: tcp,
            reachable: icmp.alive || tcp !== null
        };
    } catch (err) {
        return { domain, error: err.message };
    }
}

module.exports = realPing;
