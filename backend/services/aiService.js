const dotenv = require('dotenv');
const fs = require('fs');
const { GoogleGenerativeAI }  = require('@google/generative-ai');

dotenv.config();

const keyGemini = process.env.API_KEY;
const apiGemini = new GoogleGenerativeAI(keyGemini);

const model = apiGemini.getGenerativeModel({
    model: 'gemini-2.0-flash-thinking-exp-01-21'
});

const gemini = {

    prompt: async (prompt) => {
        const p = {
            "contents": [{
                "parts":[{
                    "text": prompt
                }]
            }]
        }
        const result = await model.generateContent(p, {timeout:60000})
        return result.response
    },

    longContext: async (prompt, context) => {
        const instrucoes = `
        Você é um analista de dados de elite com habilidades avançadas em análise quantitativa e estatística.
        Sua especialidade está na exploração, tratamento e interpretação de grandes volumes de dados, fornecendo insights estratégicos sobre produtos, gastos, clientes e outros aspectos essenciais para a tomada de decisão.

        Descrição da Tarefa:
        Você receberá um conjunto de dados juntamente com uma consulta específica. Sua tarefa é:

        Analisar Minuciosamente: Examinar e compreender toda a base de dados, identificando padrões, tendências, correlações e possíveis anomalias que possam impactar a análise.

        Sintetizar Informações: Transformar dados brutos em insights acionáveis, estruturando os resultados de forma clara e objetiva para responder à consulta fornecida.

        Apoiar sua Resposta: Apresentar métricas, estatísticas e, quando aplicável, visualizações que fundamentem suas conclusões, garantindo embasamento técnico e estratégico.

        Destacar Ambiguidades: Caso os dados sejam insuficientes, inconsistentes ou deixem margem para múltiplas interpretações, indicar claramente quaisquer limitações, hipóteses adotadas ou necessidade de dados adicionais.
        Utilize uma linguagem analítica, objetiva e baseada em evidências, adequada para relatórios corporativos, consultorias estratégicas e decisões de negócios. Sua resposta deve ser estruturada, lógica e diretamente focada na consulta fornecida.

       
        Instruções:
        Consulta: ${prompt}

        Idioma para resposta: PT-BR

        Documento: [Texto completo do ${context} fornecido]

        Forneça o título do documento e uma resposta final baseada exclusivamente no conteúdo do documento, atendendo a todos os requisitos da descrição da tarefa.
        `;

        // Construindo a requisição para a API Gemini
        const p = {
            "contents": [{
                "parts": [
                    { "text": instrucoes },
                    { "inline_data": { "data": context } }
                ]
            }]
        };

        const result = await model.generateContent(p, { timeout: 60000 });
        return result.response;
    }
};

module.exports = gemini;
