chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    if (tab && tab.url) {
      chrome.storage.local.set({ currentURL: tab.url }, () => {
        console.log("URL saved:", tab.url);
      });
    }
  });
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "summarize") {
//     console.log("Summarizing:", message.text);
//     chrome.storage.local.set({ selectedText: message.text }, () => {
//       chrome.runtime.openOptionsPage(); // Open popup for response
//     });
//   }

//   if (message.action === "askAI") {
//     console.log("Asking AI:", message.text);
//     chrome.storage.local.set({ selectedText: message.text }, () => {
//       chrome.runtime.openOptionsPage();
//     });
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "insertText") {
    chrome.storage.local.set(
      {
        selectedText: message.text,
        currentURL: message.url,
      },
      () => {
        chrome.runtime.sendMessage({ action: "updateChatbot" });
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        sendResponse({ url: tabs[0].url });
      } else {
        sendResponse({ url: null });
      }
    });
    return true; // needed to allow async sendResponse
  }
});
