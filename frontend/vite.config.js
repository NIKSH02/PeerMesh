import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  // server: {
  //     allowedHosts: ['frontend.loca.lt'],
  // },

    build: {
    chunkSizeWarningLimit: 1500,  // Size in KB (set higher as per your needs)
  },

  plugins: [react()],
})
