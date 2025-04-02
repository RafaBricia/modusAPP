const express = require('express');
const router = express.Router();
const { categoriaAllget, postCategoria, putCategoria, deleteCategoria } = require('../controller/categoriaController.js');
const withAuth = require('../controller/middleware/middlewareAuth.js');

router.get('/categoria', categoriaAllget);
router.post('/categoria', withAuth, postCategoria);
router.get('/categoria/:id', categoriaAllget);
router.put('/categoria/:id', withAuth, putCategoria);
router.delete('/categoria/:id',withAuth, deleteCategoria);

module.exports = router;