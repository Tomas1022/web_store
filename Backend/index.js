const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/db'); // ← agrega esta línea

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: '🎮 Servidor tienda_juegos funcionando' });
});

const juegosRoutes = require('./src/routes/juegos');
app.use('/juegos', juegosRoutes);

const authRoutes = require('./src/routes/auth');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

const desarrolladoresRoutes = require('./src/routes/desarrolladores');
app.use('/desarrolladores', desarrolladoresRoutes);

const comprasRoutes = require('./src/routes/compras');
app.use('/compras', comprasRoutes);
});