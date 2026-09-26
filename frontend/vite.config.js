export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      ignored: ["**/db.json"],
    },

    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
