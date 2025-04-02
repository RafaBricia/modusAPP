const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriaSchema = new Schema({
  tipo: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    enum: ["Camisas", "Saias", "Calças", "Sutiãs", "Calcinhas", "Cropped", "Meias"] 
  }
});

module.exports = mongoose.model("Categoria", categoriaSchema);