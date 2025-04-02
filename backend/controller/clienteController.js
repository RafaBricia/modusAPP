const Cliente = require("../model/clienteModel");

function verificarCPFValido(cpf) {
    try {
        if (typeof cpf !== "number") {
            return false;
        }
    
        const cpfString = cpf.toString();
        if (cpfString.length !== 11) {
            return false;
        }
    
        if (!/^\d+$/.test(cpfString)) {
            return false;
        }
    
        return true; 
    } catch (error) {
        return error; 
    }
}
function validarEmail(email) {
    try{
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);

    }catch(error){
        return error

    }
}

function validarSenha(senha) {
    try{
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/; 
        return regex.test(senha);

    }catch(error){
        return error

    }
}

const postCliente = async (req, res) => {
    try {
        const { nome, cpf, senha, email } = req.body;

        if (!nome || !cpf || !senha || !email) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarCPFValido(cpf)) {
            return res.status(400).json({ message: 'CPF deve conter 11 dígitos numéricos' });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({ message: 'E-mail inválido' });
        }

        if (!validarSenha(senha)) {
            return res.status(400).json({ message: 'A senha deve ter entre 6 e 10 caracteres, incluindo letras e números' });
        }

        const newCliente = new Cliente({ nome, cpf, senha, email });
        await newCliente.save();

        res.json({ message: "Novo Cliente criado!", Cliente: newCliente });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar Cliente.', error: error.message });
    }
};

const getAllClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar os Clientes.' });
    }
};

const getCliente = async (req, res) => {
    
    try{
        const { id } = req.params;
        const cliente = await Cliente.findById({ _id: id });
        res.json(cliente);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse cliente.', error: error.message });

    }

}

const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await Cliente.deleteOne({ _id: id });
        res.json({ message: 'Cliente deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar Cliente.' });
    }
};


const putCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, senha, email } = req.body;

        if (!nome || !cpf || !senha || !email) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!verificarCPFValido(cpf)) {
            return res.status(400).json({ message: 'CPF deve conter 11 dígitos numéricos' });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({ message: 'E-mail inválido' });
        }

        if (!validarSenha(senha)) {
            return res.status(400).json({ message: 'A senha deve ter entre 6 e 10 caracteres, incluindo letras e números' });
        }

        const clienteAtualizado = await Cliente.findByIdAndUpdate(id, { nome, cpf, senha, email }, { new: true });

        res.status(200).json({ message: 'Cliente atualizado com sucesso!', Cliente: clienteAtualizado });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar Cliente.' });
    }
};

module.exports = { getAllClientes,getCliente, postCliente, putCliente, deleteCliente };
