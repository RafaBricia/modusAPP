const express = require("express");
const wsLib = require('ws')
const http = require('http')
const WebSocketServer = wsLib.WebSocketServer
const app = express();
const server = http.createServer(app)
const ws = new WebSocketServer({server})
const cors = require('cors')


const bodyParser = require("body-parser");
const db = require("./db/database.js");


const clienteRoute = require("./route/clienteRoute.js");
const carrinhoRoute = require("./route/carrinhoRoute.js");
const produtoRoute = require("./route/produtoRoute.js");
const categoriaRoute = require('./route/categoriaRoute');
const loginRoute = require('./route/loginRoute');
const PagamentoRoute = require('./route/pagamentoRoute');
const pedidosRoute = require('./route/pedidosRoute');



app.use(bodyParser.json()); // Para ler o corpo das requisições como JSON
app.use(cors())
app.use("/api",produtoRoute);
app.use("/api",PagamentoRoute);
app.use("/api", clienteRoute);
app.use("/api",carrinhoRoute);
app.use("/api",loginRoute);
app.use("/api", categoriaRoute);
app.use("/api", pedidosRoute);


const port = 3000;
server.listen(port, () => {


 console.log(`Aplicação rodando na porta ${port}`);


});
