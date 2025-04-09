const mongoose = require("mongoose");
const { Schema } = mongoose;

const carrinhoSchema = new Schema({
  valor: { 
    type: Number, 
    required: true 
  },
  quantidade: { 
    type: Number, 
    required: true
  },
  produto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "produto", 
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cliente",
    required: true
  },
  frase: {
    type: String,
    required: false
  },
  data: {
    type: Date,
    default: Date.now, 
    required: true
  }
});

module.exports = mongoose.model("carrinho", carrinhoSchema);