// api/user-info.js
const geoip = require("geoip-lite");
const MobileDetect = require("mobile-detect");
export default async function handler(req, res) {
  if (req.method === "GET") {
    // Ambil IP pengguna
    let ip = req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;
    console.log("Original User IP:", ip);

    // Ganti jika IP lokal
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "8.8.8.8"; // Uji dengan IP publik
    }
    console.log("IP untuk GeoIP lookup:", ip);

    // GeoIP lookup
    const geo = geoip.lookup(ip);
    console.log("GeoIP Lookup Result:", geo);

    // Ambil informasi lokasi
    const location = geo ? `${geo.city || "Kota tidak tersedia"}, ${geo.country}` : "Lokasi tidak diketahui";

    // Dapatkan informasi device
    const md = new MobileDetect(req.headers["user-agent"]);
    const deviceType = md.mobile() ? "Mobile" : "Desktop";
    const deviceDetails = {
      type: deviceType,
      isTablet: md.tablet() ? true : false,
      os: md.os() || "Unknown OS",
      userAgent: req.headers["user-agent"],
    };

    console.log("Device Info:", deviceDetails);

    // Respon dengan IP, lokasi, dan detail perangkat
    res.json({ ip, location, device: deviceDetails });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
