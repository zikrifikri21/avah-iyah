const express = require("express");
const path = require("path");
const geoip = require("geoip-lite");
const MobileDetect = require("mobile-detect");
const userInfoHandler = require("./api/user-info");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Endpoint untuk mendapatkan informasi pengguna
app.get("/user-info", async (req, res) => {
  await userInfoHandler(req, res);
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
