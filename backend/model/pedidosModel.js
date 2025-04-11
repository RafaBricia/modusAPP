const mongoose = require("mongoose");
const { Schema } = mongoose;

const pedidoSchema = new Schema({

  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:"cliente", 
    required: true 
  },
  carrinho :{
    type: mongoose.Schema.Types.ObjectId, 
    ref:"carrinho", 
    required: true 
  },
  frase:{
    type: String,
    required: true 
  }

});

module.exports = mongoose.model("pedido", pedidoSchema);

