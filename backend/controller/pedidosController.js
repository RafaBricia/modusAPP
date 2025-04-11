const Pedido = require("../model/pedidosModel.js");
const Cliente = require('../model/clienteModel.js');
const Carrinho = require('../model/carrinhoModel.js')


async function ClienteExistente(client) {
    try {
        const cliente = await Cliente.findById(client._id); 
        return !!cliente;
    } catch (error) {
        return false; 
    }
}
async function CarrinhoExistente(carrinho) {
    try {
        const carrinho = await Carrinho.findById(carrinho._id).populate('produto'); 
        return !!carrinho;
    } catch (error) {
        return false; 
    }
}


const postPedido = async (req, res) => {
    try {
        const { cliente, carrinho, frase } = req.body;

        // Verificações básicas
        if (!cliente?._id || !carrinho?._id) {
            return res.status(400).json({ message: 'IDs são obrigatórios' });
        }

        // Busca documentos completos
        const clienteDoc = await Cliente.findById(cliente._id);
        const carrinhoDoc = await Carrinho.findById(carrinho._id).populate('produto');

        if (!clienteDoc || !carrinhoDoc || !carrinhoDoc.produto) {
            return res.status(404).json({ message: 'Cliente, carrinho ou produto não encontrado' });
        }
        

        const fraseString = `${clienteDoc.nome} comprou ${carrinhoDoc.quantidade}x ` +
                     `${carrinhoDoc.produto}`

        // Cria o pedido
        const newPedido = new Pedido({
            cliente: clienteDoc._id,
            carrinho: carrinhoDoc._id,
            frase: fraseString
        });

        await newPedido.save();

        res.status(201).json({
            message: "Pedido criado com sucesso!",
            pedido: {
                ...newPedido.toObject(),
                cliente: clienteDoc,
                carrinho: carrinhoDoc
            }
        });

    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ 
            message: 'Erro ao criar pedido', 
            error: error.message 
        });
    }
};


const getAllPedidos = async (_req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Não foi possível listar os pedidos.' });
    }
};

const getPedido = async (req, res) => {
    try{
        const { id } = req.params;
        const pedido = await Pedido.findById({ _id: id });
        res.json(pedido);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse pedido.', error: error.message });

    }
};

const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        await Pedido.deleteOne({ _id: id });
        res.json({ message: 'Pedido foi deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Não foi possível deletar o pedido.' });
    }
};
const putPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade, cliente } = req.body;

        if (!quantidade || !id || !cliente) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarQuantidadValida(quantidade)) { 
            return res.status(400).json({ message: 'Quantidade deve ser um número positivo.' });
        }

        if (!(await ClienteExistente(cliente))) {
            return res.status(400).json({ message: 'Cliente não encontrado.' });
        }

        let PedidoAtualizado = await Pedido.findByIdAndUpdate(
            id,
            { quantidade, cliente },
            { new: true }
        );

        res.status(200).json({ message: 'Pedido atualizado com sucesso!', Pedido: PedidoAtualizado });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar pedido.', error: error.message });
    }
};



module.exports = { getAllPedidos, putPedido, deletePedido, getPedido, postPedido };
