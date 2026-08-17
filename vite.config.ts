import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import registerCvHandler from "./api/register-cv.js";

function portfolioDataPlugin(): Plugin {
  const getFilePath = () => path.resolve(process.cwd(), "data", "portfolio.json");
  const getPublicFilePath = () => path.resolve(process.cwd(), "public", "data", "portfolio.json");

  const handleApiRequest = (req: any, res: any, next: any) => {
    if (req.url === "/api/portfolio") {
      if (req.method === "GET") {
        try {
          const filePath = getFilePath();
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(data);
            return;
          }
        } catch {
          /* fall through */
        }
      } else if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk: any) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            const filePath = getFilePath();
            const publicPath = getPublicFilePath();

            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");

            fs.mkdirSync(path.dirname(publicPath), { recursive: true });
            fs.writeFileSync(publicPath, JSON.stringify(payload, null, 2), "utf-8");

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true }));
            return;
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to save portfolio data" }));
            return;
          }
        });
        return;
      }
    } else if (req.url === "/api/register-cv" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk: any) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          req.body = body;
          // Wrap res.status/json for Express-like response helper
          const customRes = {
            setHeader: (k: string, v: string) => res.setHeader(k, v),
            status: (code: number) => {
              res.statusCode = code;
              return {
                json: (data: any) => {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                },
                end: () => res.end(),
              };
            },
          };
          await registerCvHandler(req, customRes);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal dev server error" }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: "vite-plugin-portfolio-data",
    configureServer(server) {
      server.middlewares.use(handleApiRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApiRequest);
    },
  };
}

export default defineConfig({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    portfolioDataPlugin(),
    tailwindcss(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
});
