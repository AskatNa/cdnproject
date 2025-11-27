const express = require("express");
const app = express();

app.get("/ping", async (req, res) => {
    const delay = Math.floor(Math.random() * 70) + 80; // 80–150ms
    await new Promise(r => setTimeout(r, delay));

    res.json({ region: "USA", latency: delay });
});

app.listen(9001, () => console.log("US Edge running on 9001"));
