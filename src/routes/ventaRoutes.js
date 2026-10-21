
const express = require('express');
const router = express.Router();

// IMPORTAR CONTROLADOR DE VENTAS
const ventaController = require('../controllers/ventaController');

// =======================================
// SISTEMA DE VENTAS MAYORISTAS - SEGOVI
// =======================================

// 1. LISTAR TODAS LAS VENTAS
router.get('/', ventaController.listar);

// 2. MOSTRAR FORMULARIO DE NUEVA VENTA
router.get('/nueva', ventaController.formulario);

// 3. REGISTRAR NUEVA VENTA
router.post('/guardar', ventaController.registrar);

// 4. CONSULTAR DETALLES DE UNA VENTA
router.get('/:id', ventaController.detalles);

// 5. MOSTRAR FORMULARIO PARA EDITAR
router.get('/:id/editar', ventaController.formulario);

// 6. ACTUALIZAR UNA VENTA REGISTRADA
router.post('/:id/actualizar', ventaController.actualizar);

// 7. ELIMINAR UNA VENTA
router.post('/:id/eliminar', ventaController.eliminar);

// =======================================
// EXPORTAR LAS RUTAS
// =======================================
module.exports = router;
