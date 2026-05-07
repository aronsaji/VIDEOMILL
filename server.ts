import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for n8n proxy
  app.post("/api/generate", async (req, res) => {
    const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return res.status(500).json({ error: "n8n Webhook URL not configured on server" });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`n8n responded with ${response.status}`);
      }

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error("Error proxying to n8n:", error);
      res.status(500).json({ error: "Failed to communicate with n8n" });
    }
  });

  // API Route for n8n retry proxy
  app.post("/api/retry", async (req, res) => {
    const webhookUrl = process.env.VITE_N8N_RETRY_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return res.status(500).json({ error: "n8n Retry Webhook URL not configured on server" });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`n8n (retry) responded with ${response.status}`);
      }

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error("Error proxying retry to n8n:", error);
      res.status(500).json({ error: "Failed to communicate with n8n for retry" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
