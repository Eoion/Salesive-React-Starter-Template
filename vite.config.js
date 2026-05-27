import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { salesiveConfigPlugin } from "salesive-dev-tools";
import { fileURLToPath } from "url";
import path from "path";

// Get directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        salesiveConfigPlugin()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "index.js",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                        return "index.css";
                    }
                    return "assets/[name]-[hash][extname]";
                },
                chunkFileNames: "assets/[name]-[hash].js",
            },
        },
    },
});
