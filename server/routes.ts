import type { Express } from "express";
import { createServer, type Server } from "http";

// Your external WhatsApp bot API endpoint
const EXTERNAL_API_BASE_URL = "http://interchange.proxy.rlwy.net:24084";

export async function registerRoutes(app: Express): Promise<Server> {
  // CORS middleware for all routes
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Proxy all /api requests to your external API
  app.use("/api", async (req, res) => {
    try {
      const externalUrl = `${EXTERNAL_API_BASE_URL}${req.originalUrl.replace('/api', '')}`;
      console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${externalUrl}`);
      
      const response = await fetch(externalUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`[PROXY ERROR] ${req.originalUrl}:`, error);
      res.status(500).json({ 
        error: "Proxy request failed", 
        message: "Unable to connect to WhatsApp bot API",
        originalError: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
