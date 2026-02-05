const OllamaClient = require('./services/ollama.service');
const GammaClient = require('./services/gamma.service');

module.exports = {
    services: [
        OllamaClient,
        GammaClient
    ]
}