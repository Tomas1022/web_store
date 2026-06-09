const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Importar rutas
const juegosRoutes = require('./src/routes/juegos');
const authRoutes = require('./src/routes/auth');
const desarrolladoresRoutes = require('./src/routes/desarrolladores');
const comprasRoutes = require('./src/routes/compras');
const carritoRoutes = require('./src/routes/carrito');
const recibosRoutes = require('./src/routes/recibos');

// Importar middleware
const { verificarToken } = require('./src/middlewares/auth');

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: '🎮 Servidor tienda_juegos funcionando' });
});

// Rutas públicas
app.use('/auth', authRoutes);
app.use('/juegos', juegosRoutes);
app.use('/desarrolladores', desarrolladoresRoutes);

// Rutas protegidas
app.use('/compras', verificarToken, comprasRoutes);
app.use('/carrito', verificarToken, carritoRoutes);
app.use('/recibos', verificarToken, recibosRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});