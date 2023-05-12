import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		compression({
			algorithm: "gzip",
			ext: ".gz",
		}),
		compression({
			algorithm: "brotliCompress",
			ext: ".br",
		}),
	],
	build: {
		target: "es2015",
		minify: true,
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			// Add this line
			vue: "@vue/compat",
		},
	},
});
