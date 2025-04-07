// Global variable to track chatbot state
let chatbotVisible = false;

// Function to create the chatbot UI
function createChatbot() {
  // Don't create another chatbot if one already exists
  if (document.getElementById("extension-chatbot-container")) return;
  
  // Create the main container
  const chatbotContainer = document.createElement("div");
  chatbotContainer.id = "extension-chatbot-container";
  chatbotContainer.style.position = "fixed";
  chatbotContainer.style.bottom = "20px";
  chatbotContainer.style.right = "20px";
  chatbotContainer.style.width = "350px";
  chatbotContainer.style.height = "500px";
  chatbotContainer.style.backgroundColor = "#ffffff";
  chatbotContainer.style.borderRadius = "10px";
  chatbotContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  chatbotContainer.style.zIndex = "2147483647"; // Maximum z-index
  chatbotContainer.style.display = "flex";
  chatbotContainer.style.flexDirection = "column";
  chatbotContainer.style.overflow = "hidden";
  chatbotContainer.style.fontFamily = "Arial, sans-serif";
  
  // Create the header
  const chatHeader = document.createElement("div");
  chatHeader.style.padding = "10px 15px";
  chatHeader.style.backgroundColor = "#f8f9fa";
  chatHeader.style.borderBottom = "1px solid #dee2e6";
  chatHeader.style.borderTopLeftRadius = "10px";
  chatHeader.style.borderTopRightRadius = "10px";
  chatHeader.style.display = "flex";
  chatHeader.style.justifyContent = "space-between";
  chatHeader.style.alignItems = "center";
  
  // URL display in header
  const urlDisplay = document.createElement("span");
  urlDisplay.id = "extension-current-url";
  urlDisplay.style.fontSize = "12px";
  urlDisplay.style.color = "#6c757d";
  urlDisplay.style.overflow = "hidden";
  urlDisplay.style.textOverflow = "ellipsis";
  urlDisplay.style.whiteSpace = "nowrap";
  urlDisplay.style.maxWidth = "280px";
  urlDisplay.textContent = window.location.href;
  
  // Toggle button in header
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "extension-toggle-btn";
  toggleBtn.textContent = "−";
  toggleBtn.style.border = "1px solid #ced4da";
  toggleBtn.style.borderRadius = "4px";
  toggleBtn.style.backgroundColor = "transparent";
  toggleBtn.style.padding = "0px 8px";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.fontSize = "16px";
  
  chatHeader.appendChild(urlDisplay);
  chatHeader.appendChild(toggleBtn);
  
  // Create chat content area
  const chatContent = document.createElement("div");
  chatContent.id = "extension-chat-content";
  chatContent.style.display = "flex";
  chatContent.style.flexDirection = "column";
  chatContent.style.height = "calc(100% - 42px)"; // Header height is approximately 42px
  
  // Messages container
  const chatBox = document.createElement("div");
  chatBox.id = "extension-chat-box";
  chatBox.style.flex = "1";
  chatBox.style.padding = "15px";
  chatBox.style.overflowY = "auto";
  chatBox.style.backgroundColor = "#ffffff";
  
  // Initial welcome message
  const initialMessage = document.createElement("div");
  initialMessage.style.padding = "10px 15px";
  initialMessage.style.marginBottom = "10px";
  initialMessage.style.backgroundColor = "#f1f1f1";
  initialMessage.style.borderRadius = "8px";
  initialMessage.style.color = "#212529";
  initialMessage.textContent = "Hello! How can I help you?";
  chatBox.appendChild(initialMessage);
  
  // Input area
  const inputArea = document.createElement("div");
  inputArea.style.padding = "10px 15px";
  inputArea.style.borderTop = "1px solid #dee2e6";
  inputArea.style.display = "flex";
  inputArea.style.gap = "8px";
  
  // Text input field
  const messageInput = document.createElement("input");
  messageInput.id = "extension-message-input";
  messageInput.type = "text";
  messageInput.placeholder = "Type a message...";
  messageInput.style.flex = "1";
  messageInput.style.padding = "8px 12px";
  messageInput.style.border = "1px solid #ced4da";
  messageInput.style.borderRadius = "6px";
  messageInput.style.fontSize = "14px";
  
  // Send button
  const sendBtn = document.createElement("button");
  sendBtn.id = "extension-send-btn";
  sendBtn.textContent = "Send";
  sendBtn.style.padding = "8px 16px";
  sendBtn.style.backgroundColor = "#0d6efd";
  sendBtn.style.color = "#ffffff";
  sendBtn.style.border = "none";
  sendBtn.style.borderRadius = "6px";
  sendBtn.style.cursor = "pointer";
  sendBtn.style.fontSize = "14px";
  
  // Assemble the UI components
  inputArea.appendChild(messageInput);
  inputArea.appendChild(sendBtn);
  
  chatContent.appendChild(chatBox);
  chatContent.appendChild(inputArea);
  
  chatbotContainer.appendChild(chatHeader);
  chatbotContainer.appendChild(chatContent);
  
  // Add the chatbot to the page
  document.body.appendChild(chatbotContainer);
  chatbotVisible = true;
  
  // Initialize event listeners and functionality
  initChatbotFunctionality();
  
  // Hide launcher when chatbot is visible
  const launcher = document.getElementById("extension-chatbot-launcher");
  if (launcher) {
    launcher.style.display = "none";
  }
}

// Setup all chatbot interactions and behavior
function initChatbotFunctionality() {
  const chatContainer = document.getElementById("extension-chatbot-container");
  const chatContent = document.getElementById("extension-chat-content");
  const toggleBtn = document.getElementById("extension-toggle-btn");
  const chatBox = document.getElementById("extension-chat-box");
  const messageInput = document.getElementById("extension-message-input");
  const sendBtn = document.getElementById("extension-send-btn");
  
  let isCollapsed = false;
  
  // Minimize/Maximize toggle
  toggleBtn.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      chatContent.style.display = "none";
      toggleBtn.textContent = "+";
      chatContainer.style.height = "auto";
    } else {
      chatContent.style.display = "flex";
      toggleBtn.textContent = "−";
      chatContainer.style.height = "500px";
    }
  });
  
  // Send message functionality
  function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage === "") return;
    
    // Add user message
    addMessage(userMessage, "user");
    
    // Simulated bot response after a delay
    setTimeout(() => {
      addMessage("I am just a simple bot!", "bot");
    }, 500);
    
    // Clear input field
    messageInput.value = "";
  }
  
  // Add a message to the chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.style.padding = "10px 15px";
    messageDiv.style.marginBottom = "10px";
    messageDiv.style.borderRadius = "8px";
    messageDiv.textContent = text;
    
    if (sender === "user") {
      messageDiv.style.backgroundColor = "#cfe2ff";
      messageDiv.style.color = "#084298";
      messageDiv.style.marginLeft = "20%";
      messageDiv.style.textAlign = "right";
    } else {
      messageDiv.style.backgroundColor = "#f1f1f1";
      messageDiv.style.color = "#212529";
      messageDiv.style.marginRight = "20%";
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  // Event listeners for sending messages
  sendBtn.addEventListener("click", sendMessage);
  
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
  
  // Focus on input field
  messageInput.focus();
}

// Function to create a small popup for entering a query
function createQueryPopup(selectedText, actionType) {
  // Remove any existing popups
  const existingPopup = document.getElementById("extension-query-popup");
  if (existingPopup) existingPopup.remove();
  
  // Remove any existing overlay
  const existingOverlay = document.getElementById("extension-popup-overlay");
  if (existingOverlay) existingOverlay.remove();
  
  // Create popup container
  const popup = document.createElement("div");
  popup.id = "extension-query-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.width = "400px";
  popup.style.backgroundColor = "#ffffff";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
  popup.style.zIndex = "2147483647";
  popup.style.padding = "20px";
  popup.style.fontFamily = "Arial, sans-serif";
  
  // Create header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "15px";
  
  const title = document.createElement("h3");
  title.style.margin = "0";
  title.style.fontSize = "16px";
  title.style.fontWeight = "600";
  title.textContent = actionType === "summarize" ? "Summarize Text" : "Ask AI About Selection";
  
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.fontSize = "16px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.color = "#666";
  closeBtn.onclick = () => {
    popup.remove();
    const overlay = document.getElementById("extension-popup-overlay");
    if (overlay) overlay.remove();
  };
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Selected text display
  const selectedTextElem = document.createElement("div");
  selectedTextElem.style.padding = "10px";
  selectedTextElem.style.backgroundColor = "#f8f9fa";
  selectedTextElem.style.borderRadius = "6px";
  selectedTextElem.style.fontSize = "14px";
  selectedTextElem.style.color = "#495057";
  selectedTextElem.style.marginBottom = "15px";
  selectedTextElem.style.maxHeight = "100px";
  selectedTextElem.style.overflow = "auto";
  selectedTextElem.style.borderLeft = "3px solid #0d6efd";
  
  // Truncate selected text if it's too long
  const maxLength = 150;
  const displayText = selectedText.length > maxLength 
    ? selectedText.slice(0, maxLength) + "..." 
    : selectedText;
  
  selectedTextElem.textContent = displayText;
  
  // Input field for user query
  const inputGroup = document.createElement("div");
  inputGroup.style.display = "flex";
  inputGroup.style.gap = "8px";
  inputGroup.style.marginBottom = "15px";
  
  const queryInput = document.createElement("input");
  queryInput.type = "text";
  queryInput.placeholder = actionType === "summarize" 
    ? "How would you like this summarized?" 
    : "Ask a question about this text...";
  queryInput.style.flex = "1";
  queryInput.style.padding = "10px 12px";
  queryInput.style.border = "1px solid #ced4da";
  queryInput.style.borderRadius = "6px";
  queryInput.style.fontSize = "14px";
  
  // Pre-fill query input based on action type
  if (actionType === "summarize") {
    queryInput.value = "Summarize this for me:";
  }
  
  inputGroup.appendChild(queryInput);
  
  // Action buttons
  const actionBtns = document.createElement("div");
  actionBtns.style.display = "flex";
  actionBtns.style.justifyContent = "flex-end";
  actionBtns.style.gap = "10px";
  
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.padding = "8px 16px";
  cancelBtn.style.backgroundColor = "#f8f9fa";
  cancelBtn.style.color = "#212529";
  cancelBtn.style.border = "1px solid #dee2e6";
  cancelBtn.style.borderRadius = "6px";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.fontSize = "14px";
  cancelBtn.onclick = () => {
    popup.remove();
    const overlay = document.getElementById("extension-popup-overlay");
    if (overlay) overlay.remove();
  };
  
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Send";
  submitBtn.style.padding = "8px 16px";
  submitBtn.style.backgroundColor = "#0d6efd";
  submitBtn.style.color = "#ffffff";
  submitBtn.style.border = "none";
  submitBtn.style.borderRadius = "6px";
  submitBtn.style.cursor = "pointer";
  submitBtn.style.fontSize = "14px";
  submitBtn.onclick = () => {
    // Get the query from input
    const query = queryInput.value.trim();
    
    if (query) {
      // Create chatbot if not visible
      createChatbot();
      
      // Set the query with the selected text to message input
      const messageInput = document.getElementById("extension-message-input");
      if (messageInput) {
        messageInput.value = `${query} "${selectedText}"`;
        
        // Trigger the send button click
        const sendBtn = document.getElementById("extension-send-btn");
        if (sendBtn) {
          sendBtn.click();
        }
      }
      
      // Inform background script about the inserted text
      chrome.runtime.sendMessage({
        action: "insertText",
        text: `${query} "${selectedText}"`,
        url: window.location.href
      });
    }
    
    // Remove the popup and overlay
    popup.remove();
    const overlay = document.getElementById("extension-popup-overlay");
    if (overlay) overlay.remove();
  };
  
  actionBtns.appendChild(cancelBtn);
  actionBtns.appendChild(submitBtn);
  
  // Assemble popup
  popup.appendChild(header);
  popup.appendChild(selectedTextElem);
  popup.appendChild(inputGroup);
  popup.appendChild(actionBtns);
  
  // Add popup to page
  document.body.appendChild(popup);
  
  // Focus on input
  queryInput.focus();
  
  // Listen for Enter key in query input
  queryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submitBtn.click();
    }
  });
  
  // Add dark overlay
  const overlay = document.createElement("div");
  overlay.id = "extension-popup-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "2147483646";
  
  overlay.onclick = () => {
    popup.remove();
    overlay.remove();
  };
  
  document.body.appendChild(overlay);
}

// Selection menu for text selections
function handleTextSelection(event) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  // Remove any existing selection menus
  const existingMenu = document.getElementById("extension-selection-menu");
  if (existingMenu) existingMenu.remove();
  
  if (selectedText.length > 0) {
    // Get selection coordinates
    let left, top;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    left = rect.left + window.scrollX + (rect.width / 2);
    top = rect.bottom + window.scrollY;
    
    // Create selection menu
    const menu = document.createElement("div");
    menu.id = "extension-selection-menu";
    menu.style.position = "absolute";
    menu.style.left = `${left}px`;
    menu.style.top = `${top + 10}px`;
    menu.style.backgroundColor = "white";
    menu.style.border = "1px solid #ccc";
    menu.style.borderRadius = "6px";
    menu.style.padding = "8px";
    menu.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    menu.style.zIndex = "2147483646"; // One less than chatbot
    menu.style.display = "flex";
    menu.style.gap = "8px";
    menu.style.transform = "translateX(-50%)"; // Center the menu
    
    // Create buttons
    const summarizeBtn = document.createElement("button");
    summarizeBtn.id = "extension-summarize-btn";
    summarizeBtn.textContent = "Summarize";
    summarizeBtn.style.padding = "6px 12px";
    summarizeBtn.style.border = "1px solid #e9ecef";
    summarizeBtn.style.borderRadius = "4px";
    summarizeBtn.style.backgroundColor = "#f8f9fa";
    summarizeBtn.style.cursor = "pointer";
    summarizeBtn.style.fontSize = "14px";
    
    const askAiBtn = document.createElement("button");
    askAiBtn.id = "extension-ask-ai-btn";
    askAiBtn.textContent = "Ask AI";
    askAiBtn.style.padding = "6px 12px";
    askAiBtn.style.border = "1px solid #e9ecef";
    askAiBtn.style.borderRadius = "4px";
    askAiBtn.style.backgroundColor = "#f8f9fa";
    askAiBtn.style.cursor = "pointer";
    askAiBtn.style.fontSize = "14px";
    
    // Add button click handlers
    summarizeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      menu.remove();
      createQueryPopup(selectedText, "summarize");
    });
    
    askAiBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      menu.remove();
      createQueryPopup(selectedText, "ask");
    });
    
    // Assemble menu
    menu.appendChild(summarizeBtn);
    menu.appendChild(askAiBtn);
    document.body.appendChild(menu);
    
    // Adjust position if menu goes off-screen
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
    }
    if (menuRect.bottom > window.innerHeight) {
      menu.style.top = `${top - menuRect.height - 10}px`;
    }
  }
}

// Throttle function to limit how often the selection event fires
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Attach the throttled selection handler
document.addEventListener("mouseup", throttle(handleTextSelection, 200));

// Close selection menu when clicking elsewhere
document.addEventListener("mousedown", function(event) {
  const menu = document.getElementById("extension-selection-menu");
  if (menu && !event.target.closest("#extension-selection-menu")) {
    menu.remove();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateChatbot" && message.text) {
    // Create chatbot if not already visible
    createChatbot();
    
    // Set the text in input field
    const messageInput = document.getElementById("extension-message-input");
    if (messageInput) {
      messageInput.value = message.text;
      messageInput.focus();
    }
  }
  
  // Always return true to indicate async response
  return true;
});

// Add chatbot launcher
function addChatbotLauncher() {
  // Check if launcher already exists
  if (document.getElementById("extension-chatbot-launcher")) return;
  
  const launcher = document.createElement("div");
  launcher.id = "extension-chatbot-launcher";
  launcher.textContent = "💬";
  launcher.style.position = "fixed";
  launcher.style.bottom = "20px";
  launcher.style.right = "20px";
  launcher.style.width = "50px";
  launcher.style.height = "50px";
  launcher.style.borderRadius = "25px";
  launcher.style.backgroundColor = "#0d6efd";
  launcher.style.color = "white";
  launcher.style.display = "flex";
  launcher.style.justifyContent = "center";
  launcher.style.alignItems = "center";
  launcher.style.fontSize = "24px";
  launcher.style.cursor = "pointer";
  launcher.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  launcher.style.zIndex = "2147483646";
  
  launcher.addEventListener("click", () => {
    launcher.style.display = "none";
    createChatbot();
  });
  
  document.body.appendChild(launcher);
}

// Initialize the chatbot launcher when the page is loaded
if (document.readyState === "complete" || document.readyState === "interactive") {
  addChatbotLauncher();
} else {
  window.addEventListener("DOMContentLoaded", addChatbotLauncher);
}
