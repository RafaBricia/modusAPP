const express = require('express');
const router = express.Router();
const { categoriaAllget, postCategoria, putCategoria, deleteCategoria } = require('../controller/categoriaController.js');
const withAuth = require('../controller/middleware/middlewareAuth.js');

router.get('/categoria', categoriaAllget);
router.get('/categoria/:id', categoriaAllget);

module.exports = router;