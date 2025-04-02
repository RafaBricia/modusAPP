const express = require("express");
const router = express.Router();
const carrinhoController = require("../controller/carrinhoController.js");
const withAuth = require('../controller/middleware/middlewareAuth.js');

router.get("/carrinho", withAuth, carrinhoController.getAllCarrinhos);
router.post("/carrinho", withAuth,carrinhoController.postCarrinho);
router.get("/carrinho/:id",withAuth, carrinhoController.getAllCarrinhos);
router.delete("/carrinho/:id", withAuth,carrinhoController.deleteCarrinho);
router.put("/carrinho/:id", withAuth,carrinhoController.putCarrinho);

module.exports = router;

