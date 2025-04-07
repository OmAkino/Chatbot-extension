// DOM elements
const urlDisplay = document.getElementById('urlDisplay');
const modelSelect = document.getElementById('modelSelect');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const minimizeButton = document.getElementById('minimizeButton');

// State variables
let currentUrl = "Unknown page";
let selectedModel = "gpt-3.5-turbo";
let contextForNextMessage = null;

// Initialize
function initialize() {
  // Load model preference from storage
  chrome.storage.local.get(['selectedModel'], (result) => {
    if (result.selectedModel) {
      selectedModel = result.selectedModel;
      modelSelect.value = selectedModel;
    }
  });
  
  // Set up event listeners
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  sendButton.addEventListener('click', sendMessage);
  
  modelSelect.addEventListener('change', () => {
    selectedModel = modelSelect.value;
    chrome.storage.local.set({ 'selectedModel': selectedModel });
  });
  
  minimizeButton.addEventListener('click', () => {
    window.parent.postMessage({ action: "minimizeChatbot" }, "*");
  });
  
  // Listen for messages from parent window
  window.addEventListener('message', handleIncomingMessages);
  
  // Request current URL immediately on load
  window.parent.postMessage({ action: "requestCurrentUrl" }, "*");
}

// Add a message to the chat
function addMessage(content, isUser = false, isCode = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'message user-message' : 'message ai-message';
  
  if (isCode) {
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    codeBlock.textContent = content;
    messageDiv.appendChild(codeBlock);
  } else {
    // Process markdown-like formatting for regular messages
    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
      .replace(/`(.*?)`/g, '<code>$1</code>')            // Inline code
      .replace(/\n/g, '<br>');                           // Line breaks
    
    messageDiv.innerHTML = formattedContent;
  }
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show a "thinking" indicator
function showThinking() {
  const thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'thinking';
  thinkingDiv.id = 'thinking-indicator';
  thinkingDiv.textContent = 'Thinking...';
  messagesContainer.appendChild(thinkingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove the thinking indicator
function removeThinking() {
  const thinkingDiv = document.getElementById('thinking-indicator');
  if (thinkingDiv) {
    thinkingDiv.remove();
  }
}

// Send a message to the AI
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  
  // Add user message to chat
  addMessage(message, true);
  
  // Clear input
  messageInput.value = '';
  
  // Show thinking indicator
  showThinking();
  
  // Send message to parent window (content script)
  window.parent.postMessage({
    action: "askAI",
    question: message,
    model: selectedModel,
    context: contextForNextMessage
  }, "*");
  
  // Reset context after using it
  contextForNextMessage = null;
}

// Handle incoming messages from parent window
function handleIncomingMessages(event) {
  const message = event.data;
  
  switch (message.action) {
    case "updateUrl":
      currentUrl = message.url;
      urlDisplay.textContent = currentUrl;
      break;
      
    case "aiResponse":
      // Remove thinking indicator
      removeThinking();
      
      // Add AI response to chat
      addMessage(message.answer);
      break;
      
    case "summarize":
      // Add message showing what's being summarized
      addMessage(`Summarizing selected text: "${message.text.substring(0, 100)}${message.text.length > 100 ? '...' : ''}"`, true);
      
      // Show thinking indicator
      showThinking();
      
      // Request summary from AI
      window.parent.postMessage({
        action: "askAI",
        question: "Please summarize this text:",
        model: selectedModel,
        context: message.text
      }, "*");
      break;
      
    case "askWithContext":
      // Add user message to chat
      addMessage(message.question, true);
      
      // Show thinking indicator
      showThinking();
      
      // Send question with context to AI
      window.parent.postMessage({
        action: "askAI",
        question: message.question,
        model: selectedModel,
        context: message.context
      }, "*");
      break;
  }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initialize);