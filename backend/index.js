const express = require("express");
const wsLib = require('ws');
const http = require('http');
const WebSocket = wsLib.WebSocket;
const WebSocketServer = wsLib.WebSocketServer;
const app = express();
const server = http.createServer(app);
const ws = new WebSocketServer({ server });
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require("./db/database.js");
const Carrinho = require('./model/carrinhoModel.js')


// Importação de rotas
const clienteRoute = require("./route/clienteRoute.js");
const carrinhoRoute = require("./route/carrinhoRoute.js");
const produtoRoute = require("./route/produtoRoute.js");
const categoriaRoute = require('./route/categoriaRoute.js');
const loginRoute = require('./route/loginRoute.js');
const PagamentoRoute = require('./route/pagamentoRoute.js');
const pedidosRoute = require('./route/pedidosRoute.js');
const ChatRoute = require('./route/ChatRoute.js');
const aiService = require('./services/aiService.js'); // Adicione esta linha

// Configurações do Express
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use("/api", produtoRoute);
app.use("/api", PagamentoRoute);
app.use("/api", clienteRoute);
app.use("/api", carrinhoRoute);
app.use("/api", loginRoute);
app.use("/api", categoriaRoute);
app.use("/api", pedidosRoute);
app.use("/api", ChatRoute);

// WebSocket
const clients = new Set();

ws.on('connection', (client) => {
    console.log("Cliente acabou de se conectar");
    
    client.on("message", async (message) => {
        const msg = JSON.parse(message.toString());
        
        const carrinhos = await Carrinho.find()
            .populate('cliente')
            .populate('produto');
        
        let historicoString = "Histórico de Compras:\n\n";
        
        carrinhos.forEach((carrinho, index) => {
            historicoString += 
                `Compra ${index + 1}:\n` +
                `- Cliente: ${carrinho.cliente.nome}\n` +
                `- Produto: ${carrinho.produto.nome}\n` +
                `- Quantidade: ${carrinho.quantidade}\n` +
                `- Valor Unitário: R$ ${carrinho.valor.toFixed(2)}\n` +
                `- Data: ${carrinho.data.toLocaleDateString('pt-BR')}\n` +
                `- Descrição: "${carrinho.frase}"\n\n`;
        });
        
        const context = historicoCompras;
        
        const result = await aiService.longContext(msg.text, context);
        const resultJson = { text: result.text(), sentBy: 'Gemini' };
        const msgString = JSON.stringify(resultJson);

        if (client.readyState === WebSocket.OPEN) {
            client.send(msgString);
        }
    });
});

// Inicia o servidor
const port = 3000;
server.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}`);
});