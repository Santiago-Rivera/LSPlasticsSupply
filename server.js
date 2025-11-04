const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: __dirname });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor Next.js...');

nextApp.prepare().then(() => {
    const server = express();

    server.use(express.json());

    // Manejar todas las rutas con Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) {
            console.error('❌ Error al iniciar servidor:', err);
            throw err;
        }
        console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
        console.log('🎯 ¡El sitio web está listo para usar!');
    });
}).catch((ex) => {
    console.error('❌ Error preparando Next.js:', ex);
    process.exit(1);
});
