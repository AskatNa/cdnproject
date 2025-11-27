module.exports = async function fakePing(domain) {
    // simulate latency between 20–200ms
    return Math.floor(Math.random() * 180) + 20;
};
