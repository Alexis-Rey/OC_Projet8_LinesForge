import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/OC_Projet8_LinesForge/',
  plugins: [react()],
})
