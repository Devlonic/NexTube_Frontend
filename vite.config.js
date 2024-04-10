import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      // Proxy /api requests to your API server
      '/api': {
        target: 'https://localhost:7192/', // Replace with your API server's URL
        changeOrigin: true,
        secure: false,
      },
      '/signalr': {
        target: 'https://localhost:7192/',
        changeOrigin: true,
        secure: false,
        ws: true, // it`s important to use SignalR with Websockets as transport
      },
    },
  },
});
