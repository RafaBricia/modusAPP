const express = require("express");
const router = express.Router();
const produtoController = require("../controller/produtoController.js");
const withAuth = require('../controller/middleware/middlewareAuth.js');

router.get("/produto", produtoController.getAllProdutos);
router.post("/produto", withAuth, produtoController.postProduto);
router.get("/produto/:id", produtoController.getProduto);
router.delete("/produto/:id", withAuth, produtoController.deleteProduto);
router.put("/produto/:id", withAuth, produtoController.putProduto);

module.exports = router;