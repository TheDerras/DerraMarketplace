import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced session middleware with better security and debugging
app.use(session({
  name: 'derra.sid', // Custom session ID name 
  secret: process.env.SESSION_SECRET || 'derra-secret-key-for-development-only', 
  resave: false,
  saveUninitialized: false, // Don't create session until something stored
  rolling: true, // Reset cookie expiration on each response
  store: new session.MemoryStore({ // In production, use a proper session store
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: { 
    path: '/',
    secure: process.env.NODE_ENV === 'production', // Only set to true if using HTTPS
    httpOnly: true, // Prevents JavaScript access to cookies
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Helps prevent CSRF attacks
  }
}));

// Log session activity for debugging
app.use((req, res, next) => {
  const oldEnd = res.end;
  
  // Override end method to log session info
  res.end = function(...args) {
    if (req.path.startsWith('/api/login') || req.path.startsWith('/api/register') || 
        req.path.startsWith('/api/logout') || req.path.startsWith('/api/me')) {
      console.log(`Session debug [${req.path}]: Session ID = ${req.session.id}, User ID = ${req.session.userId || 'none'}`);
    }
    
    return oldEnd.apply(this, args);
  };
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
