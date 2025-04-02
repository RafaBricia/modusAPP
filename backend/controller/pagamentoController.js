const Pagamento = require('../model/pagamentoModel.js')

function verificarQuantidadValida(qnt) {

    try{
        return qnt > 0;

    } catch(error){
        return error

    }
}

async function carrinhoExistente(cart) {
    try{
        const carrinho = await carrinho.findById(cart.id);
        return !!carrinho;

    } catch(error){
        return error 
    }
}

const postPagamento = async (req, res) => {

    try {
        const { metodo, valor, carrinho, status } = req.body;

        if (!metodo || !valor || !carrinho || !status) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        const metodosPermitidos = ["Cartão", "Pix", "Boleto"];
        if (!metodosPermitidos.includes(metodo)) {
            return res.status(400).json({ message: 'Método de pagamento inválido' });
        }

        const statusPermitidos = ["Efetuado", "Não Efetuado"];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ message: 'Status de pagamento inválido' });
        }

        if (!verificarQuantidadValida(valor)) {
            return res.status(400).json({ message: 'Valor precisa ser válido' });
        }

        if (!(await carrinhoExistente(carrinho))) {
            return res.status(400).json({ message: 'Carrinho precisa existir.' });
        }

        const newPagamento = new Pagamento({metodo, valor, carrinho, status});
        await newPagamento.save();

        res.json({ message: "Novo Pagamento foi criado!", Pagamento: newPagamento });

    } catch (error) {
        res.status(500).json({ message: 'Pagamento não foi criado.', error: error.message });
    }

    

}

const getAllPagamento = async (req, res) => {
    
    try{
        const pagamentos = await Pagamento.find();
        res.json(pagamentos);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível listar os pagamentos.', error: error.message });

    }

}

const getPagamento = async (req, res) => {
    
    try{
        const { id } = req.params;
        const pagamento = await Pagamento.findById({ _id: id });
        res.json(pagamento);

    } catch(error){
        res.status(500).json({ message: 'Não foi possível encontrar esse pagamento.', error: error.message });

    }

}

const deletePagamento = async (req, res) => {
    
    try{
        const { id } = req.params;
        await Pagamento.deleteOne({ _id: id });
        res.json({ message: 'Pagamento foi deletado com sucesso!' });

    } catch(error){
        res.status(500).json({ message: 'Erro ao deletar pagamento.', error: error.message });

    }

}

const putPagamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { metodo, valor, status } = req.body;

        if (!metodo || !valor || !status) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        const metodosPermitidos = ["Cartão", "Pix", "Boleto"];
        if (!metodosPermitidos.includes(metodo)) {
            return res.status(400).json({ message: 'Método de pagamento inválido' });
        }

        const statusPermitidos = ["Efetuado", "Não Efetuado"];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ message: 'Status de pagamento inválido' });
        }

        if (!verificarQuantidadValida(valor)) {
            return res.status(400).json({ message: 'Valor precisa ser válido' });
        }

        // Verifica se o pagamento existe
        const pagamentoExistente = await Pagamento.findById(id);
        if (!pagamentoExistente) {
            return res.status(404).json({ message: 'Pagamento não encontrado.' });
        }

        // Garante que `carrinho` não seja modificado (mantendo a unicidade)
        const pagamentoAtualizado = await Pagamento.findByIdAndUpdate(
            id,
            { metodo, valor, status }, // Mantém o `carrinho` inalterado
            { new: true }
        );

        res.status(200).json({ message: 'Pagamento atualizado com sucesso!', pagamento: pagamentoAtualizado });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar pagamento.', error: error.message });
    }
};

module.exports = { getAllPagamento, getPagamento, postPagamento, putPagamento, deletePagamento };
