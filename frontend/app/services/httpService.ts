// Corrigindo o serviço httpService
import axios from 'axios';

const httpService = {
    get: async (url: string) => {
        try {
            const result = await axios.get(url);
            return result.data;
        } catch (error) {
            console.error('Erro na requisição GET:', error);
            throw error;
        }
    },
    post: async (url:string, data:any) => {
        try {
            const result = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro na requisição POST:', error.message);
                console.error('Status:', error.response?.status);
                console.error('Dados retornados:', error.response?.data);
            } else {
                console.error('Erro desconhecido:', error);
            }
            throw error;
        }
    },
    put: async (url:string, data:any) => {
        try {
            const result = await axios.put(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro na requisição PUT:', error.message);
                console.error('Status:', error.response?.status);
                console.error('Dados retornados:', error.response?.data);
            } else {
                console.error('Erro desconhecido:', error);
            }
            throw error;
        }
    },
    delete: async (url: string) => {
        try {
            const result = await axios.delete(url);
            return result.data;
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            throw error;
        }
    }
    
};

export default httpService;