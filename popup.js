document.addEventListener('DOMContentLoaded', () => {
    const enableToggle = document.getElementById('enableChatbot');
    const modelSelect = document.getElementById('aiModel');
    
    // Load saved settings
    chrome.storage.local.get(['isEnabled', 'selectedModel'], (result) => {
      if (typeof result.isEnabled !== 'undefined') {
        enableToggle.checked = result.isEnabled;
      }
      
      if (result.selectedModel) {
        modelSelect.value = result.selectedModel;
      }
    });
    
    // Save settings when changed
    enableToggle.addEventListener('change', () => {
      const isEnabled = enableToggle.checked;
      chrome.storage.local.set({ 'isEnabled': isEnabled });
      
      // Send message to all tabs to update chatbot state
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: "updateChatbotState", isEnabled });
        });
      });
    });
    
    modelSelect.addEventListener('change', () => {
      const selectedModel = modelSelect.value;
      chrome.storage.local.set({ 'selectedModel': selectedModel });
      
      // Send message to all tabs to update the model
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: "updateAIModel", model: selectedModel });
        });
      });
    });
  });