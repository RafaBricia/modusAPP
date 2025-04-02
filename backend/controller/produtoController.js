const mongoose = require("mongoose");
const Produto = require("../model/produtoModel.js");
const Categoria = require("../model/categoriaModel.js");

// Função para verificar se o nome é válido
function verificarNome(nome) {
    return typeof nome === "string" && nome.trim().length > 0;
}

// Função para verificar se a descrição é válida
function verificarDescricao(descricao) {
    return typeof descricao === "string" && descricao.trim().length > 0;
}

// Função para verificar se o valor é um número positivo
function valorValido(valor) {
    return typeof valor === "number" && !isNaN(valor) && valor > 0;
}

function verificarQuantidadValida(qnt) {
    return Number.isInteger(qnt) && qnt > 0;
}

const postProduto = async (req, res) => {
    try {
        const { categoria, tamanho, descricao, valor, nome, quantidade} = req.body;

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!categoria || !valor || !nome || !descricao || !tamanho) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Verifica se o ID da categoria é válido
        if (!mongoose.Types.ObjectId.isValid(categoria)) {
            return res.status(400).json({ message: "ID de categoria inválido." });
        }

        if (!verificarQuantidadValida(quantidade)) { 
            return res.status(400).json({ message: 'Quantidade deve ser um número positivo.' });
        }

        // Busca a categoria no banco
        const categoriaExiste = await Categoria.findById(categoria);
        if (!categoriaExiste) {
            return res.status(400).json({ message: "Categoria não encontrada." });
        }

        // Verifica se o nome do produto é válido
        if (!verificarNome(nome)) {
            return res.status(400).json({ message: "Nome do produto deve ser preenchido." });
        }

        // Verifica se a descrição do produto é válida
        if (!verificarDescricao(descricao)) {
            return res.status(400).json({ message: "Descrição do produto deve ser preenchida." });
        }

        // Verifica se o tamanho informado é válido
        const tamanhosPermitidos = ["P", "M", "G", "GG", "XG"];
        if (!tamanhosPermitidos.includes(tamanho)) {
            return res.status(400).json({ message: "Tamanho inválido. Use P, M, G, GG ou XG." });
        }

        // Verifica se o valor é um número positivo
        if (!valorValido(valor)) {
            return res.status(400).json({ message: "Valor do produto deve ser um número positivo." });
        }

        // Criação do novo produto
        const newProduto = new Produto({ categoria, tamanho, descricao, valor, nome, quantidade });
        await newProduto.save();

        return res.status(201).json({ message: "Novo Produto foi criado!", produto: newProduto });

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
};



const getAllProdutos = async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: 'Não foi possível listar os produtos.' });
    }
};

const getProduto = async (req, res) => {
    
    try{
        const { id } = req.params;
        const produto = await Produto.findById({ _id: id });
        res.json(produto);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse Produto.', error: error.message });

    }

}


const deleteProduto = async (req, res) => {
    try {
        const { id } = req.params;
        await Produto.deleteOne({ _id: id });
        res.json({ message: 'Produto foi deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Não foi possível deletar o produto.' });
    }
};

const putProduto = async (req, res) => {

    try {
        const { id } = req.params;
        const { categoria, tamanho, descricao, valor, nome, quantidade} = req.body;

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!categoria || !valor || !nome || !descricao || !tamanho) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Verifica se o ID da categoria é válido
        if (!mongoose.Types.ObjectId.isValid(categoria)) {
            return res.status(400).json({ message: "ID de categoria inválido." });
        }

        if (!verificarQuantidadValida(quantidade)) { 
            return res.status(400).json({ message: 'Quantidade deve ser um número positivo.' });
        }

        // Busca a categoria no banco
        const categoriaExiste = await Categoria.findById(categoria);
        if (!categoriaExiste) {
            return res.status(400).json({ message: "Categoria não encontrada." });
        }

        // Verifica se o nome do produto é válido
        if (!verificarNome(nome)) {
            return res.status(400).json({ message: "Nome do produto deve ser preenchido." });
        }

        // Verifica se a descrição do produto é válida
        if (!verificarDescricao(descricao)) {
            return res.status(400).json({ message: "Descrição do produto deve ser preenchida." });
        }

        // Verifica se o tamanho informado é válido
        const tamanhosPermitidos = ["P", "M", "G", "GG", "XG"];
        if (!tamanhosPermitidos.includes(tamanho)) {
            return res.status(400).json({ message: "Tamanho inválido. Use P, M, G, GG ou XG." });
        }

        // Verifica se o valor é um número positivo
        if (!valorValido(valor)) {
            return res.status(400).json({ message: "Valor do produto deve ser um número positivo." });
        }
        const produtoAtualizado = await Produto.findByIdAndUpdate(
            id, 
            { categoria, tamanho, descricao, valor, nome, quantidade }, 
            { new: true }
        );

        if (!produtoAtualizado) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        res.status(200).json({ message: "Produto atualizado com sucesso!", produto: produtoAtualizado });

    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }

};


module.exports = { getAllProdutos, getProduto, postProduto, putProduto, deleteProduto };
