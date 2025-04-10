const Carrinho = require("../model/carrinhoModel.js");
const Produto = require("../model/produtoModel.js");
const Cliente = require('../model/clienteModel.js')


function verificarQuantidadValida(qnt) {

    try{
        return Number.isInteger(qnt) && qnt > 0;

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


async function VerificarProdutos(produto) {
    try {
        if (Array.isArray(produto)) {
            const produtosValidos = [];
            for (const p of produto) {
                const produtoAchado = await Produto.findById(p._id);
                if (!produtoAchado) {
                    return { existe: false, produtos: null }; 
                }
                produtosValidos.push(produtoAchado); 
            }
            return { existe: true, produtos: produtosValidos }; 
        } else {
            const produtoAchado = await Produto.findById(produto._id);
            return { existe: !!produtoAchado, produtos: produtoAchado ? [produtoAchado] : null };
        }
    } catch (error) {
        console.error("Erro ao verificar produtos:", error);
        return { existe: false, produtos: null };
    }
}


const postCarrinho = async (req, res) => {
    try {
        const { quantidade, produto, valor } = req.body;

        if (!quantidade || !produto || !valor) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarQuantidadValida(quantidade)) {
            return res.status(400).json({ message: 'Quantidade deve ser um inteiro positivo' });
        }

        if (!valorValido(valor)) {
            return res.status(400).json({ message: 'Valor deve ser um número positivo' });
        }

        const { existe, produtos } = await VerificarProdutos(produto);
        if (!existe || !produtos) {
            return res.status(400).json({ message: 'Produto(s) inválido(s) ou não encontrado(s)' });
        }

        const newCarrinho = new Carrinho({
            quantidade,
            valor,
            produto: Array.isArray(produto) ? produtos.map(p => p._id) : produtos[0]._id
        });

        await newCarrinho.save();

        res.json({ 
            message: "Produto(s) adicionado(s) ao carrinho!", 
            carrinho: newCarrinho 
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho.', error: error.message });
    }
};


const getAllCarrinhos = async (req, res) => {
    try {
        const carrinhos = await Carrinho.find().populate('cliente');
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
