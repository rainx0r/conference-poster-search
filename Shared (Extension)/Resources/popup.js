document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local.get(['apiKey', 'modelProvider', 'model'], (data) => {
        if (data.apiKey) {
            document.getElementById('apiKeyInput').value = data.apiKey;
        }
        if (data.modelProvider) {
            document.getElementById('modelProviderInput').value = data.modelProvider;
        }
        if (data.model) {
            document.getElementById('modelInput').value = data.model;
        }
    });
});

document.getElementById('apiKeyInput').addEventListener('input', (event) => {
    browser.runtime.sendMessage({ apiKey: event.target.value });
});

document.getElementById('modelProviderInput').addEventListener('change', (event) => {
    browser.runtime.sendMessage({ modelProvider: event.target.value });
});

document.getElementById('modelInput').addEventListener('input', (event) => {
    browser.runtime.sendMessage({ model: event.target.value });
});
