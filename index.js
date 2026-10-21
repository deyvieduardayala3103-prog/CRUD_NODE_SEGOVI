
const express = require('express');
const path = require('path');

// =======================================
// CORPORACION INDUSTRIAL SEGOVI EIRL
// SISTEMA DE GESTION DE VENTAS MAYORISTAS
// =======================================

// INICIALIZAR EXPRESS
const app = express();
const PORT = 3000;

// =======================================
// IMPORTAR LAS RUTAS
// =======================================

// Rutas de clientes mayoristas
const clientRoutes = require('./src/routes/clientRoutes');

// Rutas de ventas mayoristas
const ventaRoutes = require('./src/routes/ventaRoutes');

// =======================================
// CONFIGURAR MOTOR DE VISTAS EJS
// =======================================

app.set('view engine', 'ejs');

app.set(
    'views',
    path.join(__dirname, 'src', 'views')
);

// =======================================
// CONFIGURAR EXPRESS
// =======================================

// Procesar datos enviados por formularios
app.use(express.urlencoded({
    extended: true
}));

// Procesar datos en formato JSON
app.use(express.json());

// =======================================
// RUTA PRINCIPAL
// =======================================

app.get('/', (req, res) => {
    res.redirect('/clientes');
});

// =======================================
// RUTAS DEL SISTEMA CRUD
// =======================================

// MODULO DE CLIENTES
app.use('/clientes', clientRoutes);

// MODULO DE VENTAS MAYORISTAS
app.use('/ventas', ventaRoutes);

// =======================================
// MANEJO DE RUTAS NO ENCONTRADAS
// =======================================

app.use((req, res) => {
    res.status(404).send(
        'Pagina no encontrada - SEGOVI EIRL'
    );
});

// =======================================
// INICIAR SERVIDOR NODE.JS
// =======================================

app.listen(PORT, () => {

    console.log('================================');

    console.log(
        'CORPORACION INDUSTRIAL SEGOVI EIRL'
    );

    console.log(
        'Sistema de Gestion de Ventas Mayoristas'
    );

    console.log('Vidrio y Aluminio');

    console.log(
        `Servidor: http://localhost:${PORT}`
    );

    console.log(
        `Clientes: http://localhost:${PORT}/clientes`
    );

    console.log(
        `Ventas: http://localhost:${PORT}/ventas`
    );

    console.log('================================');

});
