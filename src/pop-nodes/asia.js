const express = require("express");
const app = express();

app.get("/ping", async (req, res) => {
    const delay = Math.floor(Math.random() * 100) + 150; // 150–250ms
    await new Promise(r => setTimeout(r, delay));

    res.json({ region: "Asia", latency: delay });
});

app.listen(9003, () => console.log("Asia Edge running on 9003"));
