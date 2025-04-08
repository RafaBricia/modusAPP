const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController.js");

router.post('/ia', chatController.talkWithGemini);
router.post('/longContext', chatController.longContext);

module.exports = router;