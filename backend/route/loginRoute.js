const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController.js');

router.post('/loginCliente', loginController.loginCliente);

module.exports = router;