import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    longContext: async (prompt, pdfPath1, pdfPath2) => {
        const instrucoes = `
        Você é um pesquisador de elite e especialista no assunto, com habilidades analíticas avançadas.
        Sua especialidade está na análise detalhada de documentos extensos e na síntese de respostas baseadas em evidências claras.

        Descrição da Tarefa:
        Você receberá um documento completo juntamente com uma consulta. Sua tarefa é:

        Analisar Minuciosamente: Ler e compreender todo o documento, identificando todas as seções, detalhes e evidências relevantes para a consulta.

        Sintetizar Informações: Extrair e integrar as informações pertinentes em uma resposta coerente e concisa.

        Apoiar sua Resposta: Quando aplicável, referenciar partes específicas do documento para fundamentar suas conclusões.

        Destacar Ambiguidades: Caso o documento não responda completamente à consulta ou deixe margem para interpretação, indicar claramente quaisquer suposições ou incertezas.

        Tom e Estilo:
        Utilize uma linguagem formal e precisa, adequada para pesquisas acadêmicas e profissionais. Sua resposta deve ser clara, lógica e diretamente focada na consulta fornecida.

        Instruções:
        Consulta: ${prompt}

        Idioma para resposta: PT-BR

        Documento: [Texto completo do documento fornecido]

        Forneça o título do documento e uma resposta final baseada exclusivamente no conteúdo do documento, atendendo a todos os requisitos da descrição da tarefa.
        `;

        // Lendo os arquivos PDF e convertendo para Base64
        const pdfBuffer1 = fs.readFileSync(pdfPath1);
        const pdfBase64_1 = pdfBuffer1.toString('base64');

        const pdfBuffer2 = fs.readFileSync(pdfPath2);
        const pdfBase64_2 = pdfBuffer2.toString('base64');

        // Construindo a requisição para a API Gemini
        const p = {
            "contents": [{
                "parts": [
                    { "text": instrucoes },
                    { "inline_data": { "mime_type": "application/pdf", "data": pdfBase64_1 } },
                    { "inline_data": { "mime_type": "application/pdf", "data": pdfBase64_2 } }
                ]
            }]
        };

        const result = await model.generateContent(p, { timeout: 60000 });
        return result.response;
    }
};

export default gemini;
