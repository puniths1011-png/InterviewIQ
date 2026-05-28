const claudeService = require('./claudeService');
const geminiService = require('./geminiService');
const groqService = require('./groqService');

const provider = process.env.AI_PROVIDER || 'claude';

let aiService;
switch (provider) {
    case 'gemini':
        aiService = geminiService;
        break;
    case 'groq':
        aiService = groqService;
        break;
    default:
        aiService = claudeService;
}

console.log(`AI Service initialized with provider: ${provider}`);

module.exports = aiService;
