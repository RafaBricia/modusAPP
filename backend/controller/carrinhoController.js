const Carrinho = require("../model/carrinhoModel.js");
const Produto = require("../model/produtoModel.js");

function verificarQuantidadValida(qnt) {

    try{
        return Number.isInteger(qnt) && qnt > 0;

    } catch(error){
        return error

    }
}


async function produtoExistente(produto) {
    try{
        const produto = await Produto.findById(produto.id);
        return !!produto;

    } catch(error){
        return error 
    }
}


function valorValido(valor) {

    try{
        return typeof valor === "number" && !isNaN(valor) && valor > 0;

    } catch(error){
        return error

    }   
}


const postCarrinho = async (req, res) => {
    try {
        const { quantidade, valor, produto } = req.body;

        if (!quantidade || !valor || !produto) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarQuantidadValida(quantidade)) {
            return res.status(400).json({ message: 'Quantidade deve ser um valor positivo' });
        }

        if (!valorValido(valor)) {
            return res.status(400).json({ message: 'Valor precisa ser válido' });
        }

        if (!(await produtoExistente(produto))) {
            return res.status(400).json({ message: 'Produto precisa existir.' });
        }

        const newCarrinho = new Carrinho({ quantidade, valor, produto});
        await newCarrinho.save();

        res.json({ message: "Novo Carrinho foi criado!", Carrinho: newCarrinho });

    } catch (error) {
        res.status(500).json({ message: 'Carrinho não foi criado.', error: error.message });
    }
};

const getAllCarrinhos = async (req, res) => {
    try {
        const carrinhos = await Carrinho.find();
        res.json(carrinhos);
    } catch (error) {
        res.status(500).json({ message: 'Não é possível listar os Carrinhos.' });
    }
};

const getCarrinho = async (req, res) => {
    
    try{
        const { id } = req.params;
        const carrinho = await Carrinho.findById({ _id: id });
        res.json(carrinho);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse Carrinho.', error: error.message });

    }

}

const deleteCarrinho = async (req, res) => {
    try {
        const { id } = req.params;
        await Carrinho.deleteOne({ _id: id });
        res.json({ message: 'Carrinho foi deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir o carrinho.' });
    }
};

const putCarrinho = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade, valor, produto } = req.body;

        if (!quantidade || !valor || !produto) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarQuantidadValida(quantidade)) {
            return res.status(400).json({ message: 'Quantidade deve ser um valor positivo' });
        }

        if (!valorValido(valor)) {
            return res.status(400).json({ message: 'Valor precisa ser válido' });
        }

        if (!(await produtoExistente(produto))) {
            return res.status(400).json({ message: 'Produto precisa existir.' });
        }

        let carrinhoAtualizado = await Carrinho.findByIdAndUpdate(
            id,
            { quantidade, valor, produto },
            { new: true }
        );

        res.status(200).json({ message: 'Carrinho atualizado com sucesso!', Carrinho: carrinhoAtualizado });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o carrinho.' });
    }
};

module.exports = { getAllCarrinhos, getCarrinho, postCarrinho, putCarrinho, deleteCarrinho };
