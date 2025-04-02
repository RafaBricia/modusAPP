const express = require("express");
const router = express.Router();
const clienteController = require("../controller/clienteController.js");
const withAuth = require('../controller/middleware/middlewareAuth.js');

router.get("/cliente", clienteController.getAllClientes);
router.post("/cliente", clienteController.postCliente);
router.get("/cliente/:id", clienteController.getCliente);
router.delete("/cliente/:id", clienteController.deleteCliente);
router.put("/cliente/:id",  clienteController.putCliente);

module.exports = router;

// router.get("/cliente/:id", withAuth,clienteController.getCliente);
// router.delete("/cliente/:id",withAuth, clienteController.deleteCliente);
// router.put("/cliente/:id", withAuth, clienteController.putCliente);