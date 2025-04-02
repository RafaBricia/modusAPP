const express = require("express");
const router = express.Router();
const pedidosController = require("../controller/pedidosController.js");
const withAuth = require('../controller/middleware/middlewareAuth.js');

router.get("/pedido", withAuth, pedidosController.getAllPedidos);
router.post("/pedido", withAuth, pedidosController.postPedido);
router.get("/pedido/:id", withAuth, pedidosController.getPedido);
router.delete("/pedido/:id", withAuth, pedidosController.deletePedido);
router.put("/pedido/:id", withAuth, pedidosController.putPedido);

module.exports = router;