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
            const context = m
            const result = await aiService.longContext(req.body.prompt,context);
            res.status(200).json(result.text());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = chatController;