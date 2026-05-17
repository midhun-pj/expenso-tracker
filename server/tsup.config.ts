import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm"],
    outDir: "dist",
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false,
    external: ["fastify", "prisma", "@prisma/client"]
});