// This project uses the TanStack Start/Vite setup generated for the invitation app.
// Keep the runtime config intact so the app can build and run correctly.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
