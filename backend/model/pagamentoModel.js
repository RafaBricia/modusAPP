const mongoose = require("mongoose");
const { Schema } = mongoose;

const pagamentoSchema = new Schema({

  metodo: { 
    type: String, 
    required: true,
    enum: [ "Cartão", "Pix", "Boleto" ]
  },

  valor: { 
    type: Number, 
    required: true
   },

  carrinho: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:"carrinho", 
    required: true ,
    unique: true
  },

  status: { 
    type: String, 
    required: true,
    enum: [ "Efetuado", "Não Efetuado" ]
  }

});

module.exports = mongoose.model("pagamento", pagamentoSchema);

