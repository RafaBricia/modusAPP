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


const getAllProdutos = async (req, res) => {
    try {
      const produtos = await Produto.find().populate("categoria");
      res.json(produtos);
    } catch (error) {
      res.status(500).json({
        message: "Não foi possível listar os produtos.",
        error: error.message,
      });
    }
};

  

const getProduto = async (req, res) => {
    
    try{
        const { id } = req.params;
        const produto = await Produto.findById({ _id: id }).populate("categoria");
        res.json(produto);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse Produto.', error: error.message });

    }

}


module.exports = { getAllProdutos, getProduto };
