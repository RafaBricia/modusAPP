const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const clienteSchema = new Schema({
  nome: { 
    type: String, 
    required: true 
  },

  cpf: { 
    type: Number, 
    required: true,
    unique: true
  },

  senha: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true,
    unique: true
  }
});

clienteSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('senha')) {
    try {
      const hashedPassword = await bcrypt.hash(this.senha, 10);
      this.senha = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

clienteSchema.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.senha, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

module.exports = mongoose.model("Cliente", clienteSchema);
