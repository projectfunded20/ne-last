import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(
  process.env["VERCEL"] ||
    process.env["NITRO_PRESET"] === "vercel" ||
    process.env["LOVABLE_NITRO_PRESET"] === "vercel",
);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    ...(isVercel ? { preset: "vercel" } : {}),
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
    },
  },
});
