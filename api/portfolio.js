import fs from "fs";
import path from "path";

const DATA_PATH = path.resolve(process.cwd(), "data", "portfolio.json");

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      if (fs.existsSync(DATA_PATH)) {
        const content = fs.readFileSync(DATA_PATH, "utf-8");
        return res.status(200).json(JSON.parse(content));
      }
      const publicDataPath = path.resolve(process.cwd(), "public", "data", "portfolio.json");
      if (fs.existsSync(publicDataPath)) {
        const content = fs.readFileSync(publicDataPath, "utf-8");
        return res.status(200).json(JSON.parse(content));
      }
      return res.status(404).json({ error: "Data file not found" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to read portfolio data" });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ error: "Invalid payload" });
      }

      try {
        const dataDir = path.dirname(DATA_PATH);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2), "utf-8");

        const publicDataPath = path.resolve(process.cwd(), "public", "data", "portfolio.json");
        if (fs.existsSync(path.dirname(publicDataPath))) {
          fs.writeFileSync(publicDataPath, JSON.stringify(payload, null, 2), "utf-8");
        }
      } catch (writeErr) {
        // In read-only serverless environments (e.g. Vercel deployment), disk writes fail.
        // We catch this gracefully so local browser state still handles persistence.
        console.warn("Could not write portfolio.json to disk (read-only filesystem):", writeErr);
      }

      return res.status(200).json({ success: true, data: payload });
    } catch (err) {
      return res.status(500).json({ error: "Failed to save portfolio data" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
