const express = require("express");
const router = express.Router();
const pedidosController = require("../controller/pedidosController.js");

router.get("/pedido", pedidosController.getAllPedidos);
router.post("/pedido", pedidosController.postPedido);
router.get("/pedido/:id", pedidosController.getPedido);
router.delete("/pedido/:id", pedidosController.deletePedido);
router.put("/pedido/:id", pedidosController.putPedido);

module.exports = router;