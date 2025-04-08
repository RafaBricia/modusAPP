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
    post: async (url: string, data: any) => {
        try {
            const result = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Detalhes do erro:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
            } else {
                console.error('Erro desconhecido:', error);
            }
            throw error;
        }
    }
};

export default httpService;