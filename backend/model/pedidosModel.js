const mongoose = require("mongoose");
const { Schema } = mongoose;

const pedidoSchema = new Schema({

  quantidade: { 
    type: Number, 
    required: true
   },

  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:"cliente", 
    required: true 
  }

});

module.exports = mongoose.model("pedido", pedidoSchema);

