const execute = async function() {

    try {
    // const { 
    //     GAMMA_API_KEY: apiKey,
    //     GAMMA_ID: gammaId, 
    //     THEME_ID: themeId
    // } = process?.env;

    const [,,apiKey, gammaId, themeId] = process.argv;

    const OllamaClient = require('../services/ollama.service');
    const GammaClient = require('../services/gamma.service');
    const ollama = new OllamaClient('http://localhost:11434');
    const gamma = new GammaClient('https://public-api.gamma.app', apiKey);

    let history = [];
    let resp;
    let message;
    let content;
    let prompt;

    // initial call to generate content
    content = "Create 5 slide presentation outline for preparing for Paris-Brest-Paris, Audax 1200";
    prompt = { role: 'user', content }
    // pass this through worker it can take longer that http timeout threshold to resolve
    resp = await ollama.prompt('gemma3:1b', prompt, history);
    
    // save prompt and message response to history. history handling can be handled by ui statemanagement or backend statemanagement
    ({ message } = resp?.data);
    history = [...history, message, prompt];

    // update prompt
    content = "prepare prompt for gamma.app llm";
    prompt = { role: 'user', content }
    resp = await ollama.prompt('gemma3:1b', prompt, history);
    
    // save prompt and message response to history. history handling can be handled by ui statemanagement or backend statemanagement
    ({ message } = resp?.data);
    history = [...history, message, prompt];

    let { content: gammaInput } = message;
    

    // this can take a few minutes to generate recommed to move to a worker service where it is queued
    // generating pdf as it is easier for vision based models to consume. Need to look for another model that can easily process pptx
    const generatingPresentation = await gamma.generatePresentation(gammaInput, gammaId, themeId, 'pptx');

    ({ generationId } = generatingPresentation?.data);

    let exportUrl;
    // wait for generation to complete, this can be handled by a worker connected to an api via web sockets, each runnable task will be updated after completion
    await setTimeout(async()=>{}, 240000)

    const retrieve = await gamma.getGeneratedPresentation(generationId);

    ({exportUrl} = retrieve?.data); // export url is the generated pdf

    if(!exportUrl) {
        console.log('generation not yet complete');
        process.exit(0);
    }

    // validate for defects
    content = `check presentation in ${exportUrl}, if text is readable and has adequate spacing`;
    prompt = { role: 'user', content }
    resp = await ollama.prompt('deepseek-v3.1:671b-cloud', prompt, history);

    // save prompt and message response to history. history handling can be handled by ui statemanagement or backend statemanagement
    ({ message } = resp?.data);

    history = [...history, message, prompt];

    process.exit(0);

    } catch(e){
        console.trace(e);
    }
}

execute();