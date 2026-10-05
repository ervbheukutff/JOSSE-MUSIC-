import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "child_process";
import path from "path";

// Plugin que arranca el backend real (Express) como proceso hijo cuando
// Vite inicia. Esto evita envolver "vite" dentro de concurrently, lo cual
// impedía que la plataforma inyectara correctamente las banderas --host y
// --base al proceso de Vite (quedaban atrapadas por el wrapper), rompiendo
// la sub-ruta real de la vista previa.
function backendPlugin() {
  let started = false;
  return {
    name: "start-backend-server",
    configureServer() {
      if (started) return;
      started = true;
      const serverDir = path.resolve(__dirname, "server");
      const child = spawn("npm", ["start"], {
        cwd: serverDir,
        stdio: "inherit",
        shell: true,
      });
      child.on("exit", (code) => {
        console.log(`[backend] proceso terminado con código ${code}`);
      });
      const cleanup = () => {
        try {
          child.kill();
        } catch {}
      };
      process.on("exit", cleanup);
      process.on("SIGINT", cleanup);
      process.on("SIGTERM", cleanup);
    },
  };
}

export default defineConfig({
  plugins: [react(), backendPlugin()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // La vista previa se sirve bajo una sub-ruta (BASE_URL), así que las peticiones
      // al API llegan como "/esa-sub-ruta/api/...". Esta regex detecta "/api" en
      // cualquier posición y reescribe a "/api/..." puro antes de reenviar al backend.
      "^.*\\/api(\\/.*)?$": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^.*\/api/, "/api"),
      },
    },
  },
});
