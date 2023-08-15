import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // forward api calls to dev port during development
            "/api": "http://localhost:3000",
        }
    },
});
