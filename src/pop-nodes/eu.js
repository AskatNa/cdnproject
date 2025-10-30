const express = require("express");
const app = express();

app.get("/ping", async (req, res) => {
    const delay = Math.floor(Math.random() * 30) + 20; // 20–50ms
    await new Promise(r => setTimeout(r, delay));

    res.json({ region: "EU", latency: delay });
});

app.listen(9002, () => console.log("EU Edge running on 9002"));
