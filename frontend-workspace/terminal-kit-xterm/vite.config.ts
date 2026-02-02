import * as path from "node:path"
import { defineConfig } from "vite"
import dtsPlugin from "vite-plugin-dts"

// https://vite.dev/config/
export default defineConfig({
  plugins: [dtsPlugin({ rollupTypes: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "@xterm/xterm",
        "terminal-ext",
        "@xterm/addon-clipboard",
        "@xterm/addon-fit",
        "@xterm/addon-image",
        "@xterm/addon-unicode11",
      ],
    },
  },
})
