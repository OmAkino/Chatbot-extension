let chatbotFrame = null;
let isFrameVisible = false;
let selectionPopup = null;

function createChatbotFrame() {
  chatbotFrame = document.createElement("iframe");
  chatbotFrame.src = chrome.runtime.getURL("chatbot.html");
  chatbotFrame.id = "ai-chatbot-frame";
  chatbotFrame.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    transition: all 0.3s ease;
    display: none;
  `;

  document.body.appendChild(chatbotFrame);

  const toggleButton = document.createElement("div");
  toggleButton.id = "ai-chatbot-toggle";
  toggleButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #5c6bc0;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9998;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `;

  document.body.appendChild(toggleButton);

  toggleButton.addEventListener("click", toggleChatbot);

  window.addEventListener("message", handleFrameMessages);

  chrome.storage.local.get(["isEnabled"], (result) => {
    if (result.isEnabled) {
      isFrameVisible = false; 
    }
  });

  createSelectionPopupElement();

  injectStyles();

  updateCurrentUrl();

  // Check if auto-scrape is enabled
  chrome.storage.local.get(["autoScrapeEnabled"], (result) => {
    if (result.autoScrapeEnabled) {
      // Send message to background to scrape the current page
      chrome.runtime.sendMessage({ action: "scrapeCurrentPage" });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateChatbotState") {
    } else if (message.action === "updateAIModel") {
    } else if (message.action === "scrapePage") {
      chrome.runtime.sendMessage({ action: "scrapeCurrentPage" });
    }
  });
}

function createSelectionPopupElement() {
  selectionPopup = document.createElement("div");
  selectionPopup.id = "ai-selection-popup";
  selectionPopup.className = "ai-selection-popup";
  selectionPopup.innerHTML = `
    <button id="ai-summarize-btn" class="ai-popup-btn">Summarize</button>
    <button id="ai-ask-btn" class="ai-popup-btn">Ask AI</button>
    <button id="ai-scrape-btn" class="ai-popup-btn">Save Content</button>
  `;
  selectionPopup.style.display = "none";
  document.body.appendChild(selectionPopup);

  document
    .getElementById("ai-summarize-btn")
    .addEventListener("click", handleSummarize);
  document.getElementById("ai-ask-btn").addEventListener("click", handleAsk);
  document
    .getElementById("ai-scrape-btn")
    .addEventListener("click", handleScrape);
}

function handleScrape() {
  selectionPopup.style.display = "none";

  chrome.runtime.sendMessage({ action: "scrapeCurrentPage" }, (response) => {
    if (response && response.success) {
      showNotification("Page content saved successfully!");
    } else {
      showNotification("Failed to save page content", true);
    }
  });
}

function showNotification(message, isError = false) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    padding: 10px 15px;
    background-color: ${isError ? "#f44336" : "#4CAF50"};
    color: white;
    border-radius: 4px;
    z-index: 10000;
    font-family: 'Segoe UI', sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function injectStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .ai-selection-popup {
      position: absolute;
      background: white;
      border-radius: 6px;
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.2);
      padding: 8px;
      z-index: 10000;
      display: flex;
      gap: 8px;
    }
    
    .ai-popup-btn {
      background: #5c6bc0;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }
    
    .ai-popup-btn:hover {
      background: #4a59a7;
    }
    
    .ai-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }
    
    .ai-popup {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 400px;
      max-width: 90%;
      max-height: 90vh;
      overflow: auto;
    }
  `;
  document.head.appendChild(styleElement);
}

function toggleChatbot() {
  isFrameVisible = !isFrameVisible;

  if (isFrameVisible) {
    chatbotFrame.style.display = "block";
    document.getElementById("ai-chatbot-toggle").style.display = "none";
    updateCurrentUrl();
  } else {
    chatbotFrame.style.display = "none";
    document.getElementById("ai-chatbot-toggle").style.display = "flex";
  }
}

function updateCurrentUrl() {
  chrome.runtime.sendMessage({ action: "getTabUrl" }, (response) => {
    if (response && response.url && chatbotFrame) {
      chatbotFrame.contentWindow.postMessage(
        {
          action: "updateUrl",
          url: response.url,
        },
        "*"
      );
    }
  });
}

function handleUrlChange() {
  const currentUrl = window.location.href;
  if (chatbotFrame) {
    chatbotFrame.contentWindow.postMessage(
      {
        action: "updateUrl",
        url: currentUrl,
      },
      "*"
    );
  }
}

let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    handleUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

function handleFrameMessages(event) {
  if (!chatbotFrame || event.source !== chatbotFrame.contentWindow) return;

  const message = event.data;

  switch (message.action) {
    case "askAI":
      chrome.runtime.sendMessage(
        {
          action: "askAI",
          question: message.question,
          model: message.model,
          context: message.context,
        },
        (response) => {
          if (response) {
            chatbotFrame.contentWindow.postMessage(
              {
                action: "aiResponse",
                answer: response.answer,
              },
              "*"
            );
          }
        }
      );
      break;

    case "minimizeChatbot":
      toggleChatbot();
      break;

    case "requestCurrentUrl":
      updateCurrentUrl();
      break;
  }
}

document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  selectionPopup.style.display = "none";

  if (selectedText.length > 10) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    let left = rect.left + scrollLeft;
    let top = rect.bottom + scrollTop + 10;

    selectionPopup.setAttribute("data-selection", selectedText);

    selectionPopup.style.left = left + "px";
    selectionPopup.style.top = top + "px";
    selectionPopup.style.display = "flex";
  }
});

function handleSummarize() {
  const selectedText = selectionPopup.getAttribute("data-selection");

  if (selectedText && chatbotFrame) {
    isFrameVisible = true;
    chatbotFrame.style.display = "block";
    document.getElementById("ai-chatbot-toggle").style.display = "none";

    chatbotFrame.contentWindow.postMessage(
      {
        action: "summarize",
        text: selectedText,
      },
      "*"
    );

    selectionPopup.style.display = "none";
  }
}

function handleAsk() {
  const selectedText = selectionPopup.getAttribute("data-selection");

  if (selectedText) {
    createAskPopup(selectedText);
    selectionPopup.style.display = "none";
  }
}

// Create popup for asking questions
function createAskPopup(selectedText) {
  // Create overlay
  const popupOverlay = document.createElement("div");
  popupOverlay.className = "ai-popup-overlay";

  // Create popup content
  const popup = document.createElement("div");
  popup.className = "ai-popup";
  popup.innerHTML = `
    <h3 style="margin-top: 0; font-family: system-ui, sans-serif; color: #333;">Ask AI about this selection</h3>
    <textarea id="ai-question" placeholder="Type your question here..." rows="3" style="width: 100%; margin: 10px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-family: inherit;"></textarea>
    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button id="ai-cancel-btn" style="padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; background: #f0f0f0;">Cancel</button>
      <button id="ai-send-btn" style="padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; background: #5c6bc0; color: white;">Send</button>
    </div>
  `;

  popupOverlay.appendChild(popup);
  document.body.appendChild(popupOverlay);

  // Focus the textarea after a brief delay
  setTimeout(() => {
    const textarea = document.getElementById("ai-question");
    if (textarea) textarea.focus();
  }, 100);

  // Add event listeners
  document.getElementById("ai-cancel-btn").onclick = function () {
    popupOverlay.remove();
  };

  document.getElementById("ai-send-btn").onclick = function () {
    const question = document.getElementById("ai-question").value.trim();

    if (question && chatbotFrame) {
      // Make chatbot visible
      isFrameVisible = true;
      chatbotFrame.style.display = "block";
      document.getElementById("ai-chatbot-toggle").style.display = "none";

      // Send message to ask with context
      chatbotFrame.contentWindow.postMessage(
        {
          action: "askWithContext",
          question: question,
          context: selectedText,
        },
        "*"
      );
    }

    popupOverlay.remove();
  };
}

// Hide popup when clicking elsewhere
document.addEventListener("mousedown", (e) => {
  if (selectionPopup && selectionPopup.style.display !== "none") {
    // Check if click is outside the popup
    if (!selectionPopup.contains(e.target)) {
      selectionPopup.style.display = "none";
    }
  }
});

// Initialize when the document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createChatbotFrame);
} else {
  createChatbotFrame();
}
