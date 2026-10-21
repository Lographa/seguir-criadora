import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // O backend libera por padrão (FRONTEND_ORIGIN) a origem http://localhost:5173.
    // Com strictPort, se a porta estiver ocupada o Vite falha em vez de trocar de porta
    // silenciosamente (o que quebraria o CORS).
    port: 5173,
    strictPort: true,
  },
});
