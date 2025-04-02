const Pedido = require("../model/pedidosModel.js");
const Cliente = require('../model/clienteModel.js')


function verificarQuantidadValida(qnt) {
    return Number.isInteger(qnt) && qnt > 0;
}

async function ClienteExistente(client) {
    try {
        const cliente = await Cliente.findById(client); // Correção aqui
        return !!cliente;
    } catch (error) {
        return false; // Correção para evitar erro como retorno
    }
}



const postPedido = async (req, res) => {
    try {

        const { quantidade, cliente } = req.body;

        if (!quantidade || !cliente) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarQuantidadValida(quantidade)) { 
            return res.status(400).json({ message: 'Quantidade deve ser um número positivo.' });
        }

        if (!(await ClienteExistente(cliente))) {
            return res.status(400).json({ message: 'Cliente não encontrado.' });
        }

        const newPedido = new Pedido({ quantidade, cliente });
        await newPedido.save();

        res.json({ message: "Novo Pedido foi criado!", Pedido: newPedido });

    } catch (error) {
        res.status(500).json({ message: 'Pedido não foi criado.', error: error.message });
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
