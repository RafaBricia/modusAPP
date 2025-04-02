const express = require('express');
const router = express.Router();
const PagamentoController = require('../controller/pagamentoController.js');
const withAuth = require('../controller/middleware/middlewareAuth.js');


router.get('/pagamento', withAuth, PagamentoController.getAllPagamento);
router.post('/pagamento', withAuth, PagamentoController.postPagamento);
router.get('/pagamento/:id',withAuth, PagamentoController.getPagamento);
router.put('/pagamento/:id', withAuth,PagamentoController.putPagamento);
router.delete('/pagamento/:id', withAuth, PagamentoController.deletePagamento);

module.exports = router;