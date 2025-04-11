const jwt = require("jsonwebtoken");
const Cliente = require("../model/clienteModel");
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const loginCliente = async (req, res) => {
    const { email, senha } = req.body;
    try {
        let cliente = await Cliente.findOne({ email });

        if (!cliente) {
            return res.status(400).json({ message: "E-mail não cadastrado" });
        }

        cliente.isCorrectPassword(senha, function (err, same) {
            if (!same) {
                return res.status(401).json({ message: "Senha inválida" });
            }

            const token = jwt.sign({ id: cliente._id, email: cliente.email }, secret, { expiresIn: '1h' });

            return res.status(200).json({ 
                message: "Login realizado com sucesso", 
                cliente: { nome: cliente.nome, email: cliente.email, id: cliente._id},
                token 
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Erro ao buscar cliente" });
    }
};

module.exports = { loginCliente };
