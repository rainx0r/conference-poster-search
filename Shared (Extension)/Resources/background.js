const SYSTEM_PROMPT = `
You are a helpful AI conference assistant aiding attendees to find posters
that are most relevant to their research interests.

You will take in the user prompt denoted by USER_PROMPT and based on their requests
filter down the list of posters (denoted by POSTERS, array of JSON objects) to just the ones that seem to be relevant.

The user's request might just be a list of research interest but it could also be more
descriptive in regards to what type of content they would like to see.
You are to adhere to their request either way.

Use the contents of each poster's "title" and "abstract" fields to determine its relevancy.

Return a JSON list of the poster IDs that are for relevant papers. The list should just contain the integer IDs.
`

let posterList = null
let apiKey = null
let modelProvider = null
let model = null

browser.storage.local.get(['apiKey', 'modelProvider', 'model']).then((data) => {
    if (data.apiKey) apiKey = data.apiKey;
    if (data.modelProvider) modelProvider = data.modelProvider;
    if (data.model) model = data.model;
});

function callOpenAI(msgs, callback) {
    const openaiMsgs = [{ role: "system" , content: SYSTEM_PROMPT }].concat(msgs);
    const requestBody = {
        model: model,
        messages: msgs,
        temperature: 0.2,
        response_format: {
            type: "json_object",
        },
    }
    fetch(LLM_URL_MAP.OPENAI, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        method: "POST",
        body: JSON.stringify(requestBody),
    }).then(r => r.text()).then(result => {
        callback(result);
    });
}

function callGemini(msgs) {
    const geminiMsgs = msgs.map((x) => {
        return {
            role: x.role,
            parts: [{ text: x.content }],
        }
    });
    const requestBody = {
        system_instruction: { parts: { text: SYSTEM_PROMPT } },
        contents: geminiMsgs,
        generationConfig: {
            temperature: 0.2,
        }
    }
    return fetch(`${LLM_URL_MAP.GOOGLE}?key=${apiKey}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(requestBody),
    }).then((res) => res.json()).then((response) => {
        console.log(response);
        const actualResponse = response.candidates[0].content.parts[0].text.replace('```json','').replace('```', '').replace('\n', '');
       return JSON.parse(actualResponse);
    });
}

const LLM_URL_MAP = {
    OPENAI: "https://api.openai.com/v1/chat/completions",
    ANTHROPIC: "...",
    GOOGLE: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
}

function callLLM(prompt) {
    const messagesToSend = [{
        role: "user",
        content: `POSTERS: ${JSON.stringify(posterList)}`,
    }, {
        role: "user",
        content: `USER_PROMPT: ${prompt}`
    }];
    if (modelProvider === "GOOGLE") {
        return callGemini(messagesToSend);
    }
}


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.posters) {
        posterList = request.posters;
    }
    if (request.apiKey) {
        apiKey = request.apiKey;
        browser.storage.local.set({ apiKey });
    }
    if (request.modelProvider) {
        modelProvider = request.modelProvider;
        browser.storage.local.set({ modelProvider });
    }
    if (request.model) {
        model = request.model;
        browser.storage.local.set({ model });
    }
    if (request.prompt) {
        if (!posterList || !apiKey || !modelProvider || !model) {
            console.error("Got a prompt to run before the rest of the required details have been provided.")
        } else {
            callLLM(request.prompt).then((response) => {
                sendResponse({ filter: response });
            });
        }
        return true;
    }
});
