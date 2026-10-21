
const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');

// 1. LISTAR CLIENTES MAYORISTAS
router.get('/', clientController.listar);

// 2. MOSTRAR FORMULARIO DE REGISTRO
router.get('/nuevo', clientController.formulario);

// 3. REGISTRAR UN CLIENTE
router.post('/guardar', clientController.registrar);

// 4. VER DETALLES DE UN CLIENTE
router.get('/:id', clientController.detalles);

// 5. MOSTRAR FORMULARIO DE EDICION
router.get('/:id/editar', clientController.formulario);

// 6. ACTUALIZAR DATOS DEL CLIENTE
router.post('/:id/actualizar', clientController.actualizar);

// 7. ELIMINAR UN CLIENTE
router.post('/:id/eliminar', clientController.eliminar);

// EXPORTAR LAS RUTAS
module.exports = router;
