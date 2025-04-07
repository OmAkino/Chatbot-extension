// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    // Initialize default settings
    chrome.storage.local.set({
      'isEnabled': true,
      'selectedModel': 'gpt-3.5-turbo'
    });
  });
  
  // Listen for messages from content script or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabUrl") {
      // Get the active tab's URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          sendResponse({ url: tabs[0].url });
        } else {
          sendResponse({ url: "Unknown URL" });
        }
      });
      return true; // Required for async sendResponse
    }
    
    if (request.action === "askAI") {
      // Here you would connect to your AI service
      // For demonstration, we'll just echo the question
      const model = request.model || "gpt-3.5-turbo";
      const question = request.question;
      
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        let response = `You asked: "${question}" using model: ${model}.\n\nThis is where you would integrate with an actual AI API.`;
        
        if (request.context) {
          response += `\n\nContext: ${request.context}`;
        }
        
        sendResponse({ answer: response });
      }, 1000);
      
      return true; // Required for async sendResponse
    }
  });