import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/OC_Projet8_LinesForge/' : '/', //Permet de basculer entre le dev en local ou la prod sur gh-pages
  plugins: [react()],
})
