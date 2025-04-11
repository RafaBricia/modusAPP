const express = require("express");
const router = express.Router();
const produtoController = require("../controller/produtoController.js");

router.get("/produto", produtoController.getAllProdutos);
router.get("/produto/:id", produtoController.getProduto);

module.exports = router;