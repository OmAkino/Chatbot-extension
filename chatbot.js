const urlDisplay = document.getElementById('urlDisplay');
const modelSelect = document.getElementById('modelSelect');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const minimizeButton = document.getElementById('minimizeButton');

let currentUrl = "Unknown page";
let selectedModel = "gpt-3.5-turbo";
let contextForNextMessage = null;

function initialize() {
  chrome.storage.local.get(['selectedModel'], (result) => {
    if (result.selectedModel) {
      selectedModel = result.selectedModel;
      modelSelect.value = selectedModel;
    }
  });
  
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
  
  window.addEventListener('message', handleIncomingMessages);
  
  window.parent.postMessage({ action: "requestCurrentUrl" }, "*");
}

function addMessage(content, isUser = false, isCode = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'message user-message' : 'message ai-message';
  
  if (isCode) {
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    codeBlock.textContent = content;
    messageDiv.appendChild(codeBlock);
  } else {
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

function showThinking() {
  const thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'thinking';
  thinkingDiv.id = 'thinking-indicator';
  thinkingDiv.textContent = 'Thinking...';
  messagesContainer.appendChild(thinkingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeThinking() {
  const thinkingDiv = document.getElementById('thinking-indicator');
  if (thinkingDiv) {
    thinkingDiv.remove();
  }
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  
  addMessage(message, true);
  
  messageInput.value = '';
  
  showThinking();
  
  window.parent.postMessage({
    action: "askAI",
    question: message,
    model: selectedModel,
    context: contextForNextMessage
  }, "*");
  
  contextForNextMessage = null;
}

function handleIncomingMessages(event) {
  const message = event.data;
  
  switch (message.action) {
    case "updateUrl":
      currentUrl = message.url;
      urlDisplay.textContent = currentUrl;
      break;
      
    case "aiResponse":
      removeThinking();
      
      addMessage(message.answer);
      break;
      
    case "summarize":
      addMessage(`Summarizing selected text: "${message.text.substring(0, 100)}${message.text.length > 100 ? '...' : ''}"`, true);
      
      showThinking();
      
      window.parent.postMessage({
        action: "askAI",
        question: "Please summarize this text:",
        model: selectedModel,
        context: message.text
      }, "*");
      break;
      
    case "askWithContext":
      addMessage(message.question, true);
      
      showThinking();
      
      window.parent.postMessage({
        action: "askAI",
        question: message.question,
        model: selectedModel,
        context: message.context
      }, "*");
      break;
  }
}

document.addEventListener('DOMContentLoaded', initialize);