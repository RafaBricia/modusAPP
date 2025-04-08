const aiService = require('../services/aiService.js');

const chatController = {
    talkWithGemini: async (req, res) => {
        try {
            const result = await aiService.prompt(req.body.prompt);
            res.status(200).json(result.text());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    longContext: async (req, res) => {
        try {
            const pdfPath1 = './src/context/dadosAnaliticos_MODA.pdf';
            const pdfPath2 = './src/context/tendencias2025.pdf';
            const result = await aiService.longContext(req.body.prompt, pdfPath1, pdfPath2);
            res.status(200).json(result.text());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = chatController;