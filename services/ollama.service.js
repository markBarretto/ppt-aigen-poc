const axios = require('axios');

module.exports = class OllamaClient {
    constructor(url) {
        this.url = url;
    }

    listModels() {
        return axios.get(`${this.url}/api/ps`);
    }

    // TODO move to typescript to declare input types and structure interfaces
    prompt(model, prompt, history) {
        return axios.post(`${this.url}/api/chat`, {
            "model": model,
            "stream": false,
            "messages": [ prompt, ...history]
        });
    }
}
