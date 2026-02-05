const axios = require('axios');

// const { GAMMA_API_KEY: apiKey } = process?.env;

module.exports = class GammaClient {
    constructor (url, apiKey) {
        this.url = url;
        this.apiKey = apiKey;
    }

    generatePresentation(prompt, gammaId, themeId, format) {
        return axios.post(`${this.url}/v1.0/generations/from-template`,
        // todo move to ts define interface
        {
            gammaId, //"g_4afzmz7azisvqpo",
            prompt,
            themeId, // "ljcw8uud4xn6keg",
            "exportAs": format, // "pptx", "pdf"
            "imageOptions": { 
                "model": "imagen-4-pro",
                "style": "photorealistic"
            },
            sharingOptions: {
                "workspaceAccess": "view",
                "externalAccess": "noAccess",
                "emailOptions": {
                    "recipients": ["email@example.com"],
                    "access": "comment"
                }
            }
        },
        {
            "headers": {
                "Content-Type": "application/json",
                "X-API-KEY": this.apiKey
            }
        });
    }

    getGeneratedPresentation(id) {
        return axios.get(`${this.url}/v1.0/generations/${id}`, 
        {
            "headers": {
                "Content-Type": "application/json",
                "X-API-KEY": this.apiKey
            }
        });
    }
}
