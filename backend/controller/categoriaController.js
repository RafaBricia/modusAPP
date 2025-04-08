const mongoose = require("mongoose");
const Categoria = require("../model/categoriaModel.js");

function verificarTipoValido(tipo) {
  try{
    return typeof tipo === "string" && tipo.trim().length > 0;

  }catch(error){
      return error

  }
}
;

const categoriaAllget = async (req, res) => {
  try {
    const categorias = (await Categoria.find());
    res.json(categorias);
  } catch (error) {
    res.status(500).json({
      message: "Não foi possível listar as categorias.",
      error: error.message,
    });
  }
};

const getCategoria = async (req, res) => {
    
    try{
        const { id } = req.params;
        const categoria = await Categoria.findById({ _id: id });
        res.json(categoria);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse categoria.', error: error.message });

    }

}


const deleteCategoria = async (req, res) => {
  try {
      const { id } = req.params;
      await Categoria.deleteOne({ _id: id });
      res.json({ message: 'Categoria foi deletada com sucesso!' });
  } catch (error) {
      res.status(500).json({ message: 'Não foi possível deletar a Categoria.' });
  }
};


const putCategoria = async (req, res) => {
  try {
    const { tipo } = req.body;

    if (!tipo ) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const postCategoria = async (req, res) => {
      try {
        const { tipo } = req.body;
    
        if (!tipo) {
          return res.status(400).json({ message: 'O campo "tipo" é obrigatório.' });
        }
    
        // Verifica se o valor de "tipo" já está no enum
        const valoresPermitidos = ["Camisas", "Saias", "Calças", "Sutiãs", "Calcinhas", "Cropped", "Meias"];
        if (!valoresPermitidos.includes(tipo)) {
          // Adiciona o novo valor ao enum
          valoresPermitidos.push(tipo);
          categoriaSchema.path('tipo').enum(valoresPermitidos);
        }
    
        // Cria a nova categoria
        const newCategoria = new Categoria({ tipo });
        await newCategoria.save();
    
        res.status(201).json({ message: "Nova categoria criada com sucesso!", categoria: newCategoria });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao criar categoria.', error: error.message });
      }
    };
} catch (error) {
    res.status(500).json({ message: 'Categoria não foi criada.', error: error.message });
}
}
module.exports = {categoriaAllget, getCategoria};
