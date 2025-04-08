const mongoose = require("mongoose");
const { Schema } = mongoose;

const produtoSchema = new Schema({
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria', 
        required: true
    },

    nome: { 
        type: String, 
        required: true 
    },

    tamanho: {
        type: String, 
        required: true,
        enum: ["P", "M", "G", "GG", "XG"]
    },

    valor: {
        type: Number, 
        required: true
    },

    descricao: { 
        type: String, 
        required: true
    },

    quantidade: { 
        type: Number, 
        required: true
    },
    imagem:{
        type: String
    }
});



module.exports = mongoose.model("produto", produtoSchema);
