document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chatbot-container");
    const chatContent = document.getElementById("chat-content");
    const toggleBtn = document.getElementById("toggle-btn");
    const urlDisplay = document.getElementById("current-url");
    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
  
    let isCollapsed = false;
  
    // === Minimize / Expand Chatbot ===
    toggleBtn.addEventListener("click", () => {
      isCollapsed = !isCollapsed;
      chatContent.style.display = isCollapsed ? "none" : "block";
      toggleBtn.textContent = isCollapsed ? "+" : "−";
    });
  
    // === Fetch Current Tab URL ===
    chrome.runtime.sendMessage({ action: "getTabUrl" }, (response) => {
      urlDisplay.textContent = response && response.url ? response.url : "Unable to fetch URL";
    });
  
    // === Listen for selected text from content script ===
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "updateChatbot" && message.text) {
        insertSelectedText(message.text);
      }
    });
  
    // === Send message logic ===
    sendBtn.addEventListener("click", () => {
      const userMessage = messageInput.value.trim();
      if (userMessage === "") return;
  
      addMessage(userMessage, "user");
  
      setTimeout(() => {
        addMessage("I am just a simple bot!", "bot");
      }, 1000);
  
      messageInput.value = "";
    });
  
    messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendBtn.click();
      }
    });
  
    function addMessage(text, sender) {
      const messageDiv = document.createElement("div");
      messageDiv.className = sender === "user"
        ? "alert alert-primary text-end"
        : "alert alert-secondary";
      messageDiv.textContent = text;
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    function insertSelectedText(text) {
      messageInput.value = text;
      messageInput.focus();
    }
  });
  