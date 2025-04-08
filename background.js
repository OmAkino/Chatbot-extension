chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isEnabled: true,
    selectedModel: "gpt-3.5-turbo",
  });
});

// Function to scrape and save content as text
async function scrapeAndSaveContent(tabId, url) {
  try {
    // Execute script to get page content
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        // Extract text content from the page
        const getTextContent = () => {
          // Get visible text from the page
          const bodyText =
            document.body.innerText || document.body.textContent || "";
          // Get the page title
          const titleText = document.title || "";
          // Combine with page metadata
          return `Page Title: ${titleText}\nURL: ${window.location.href}\n\nCONTENT:\n${bodyText}`;
        };

        return {
          title: document.title,
          content: getTextContent(),
          url: window.location.href,
        };
      },
    });

    // Get content from the result
    const data = result[0].result;

    // Create a clean filename from the title
    let filename = data.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    if (filename.length > 50) {
      filename = filename.substring(0, 50);
    }
    filename += ".txt"; // Change file extension to .txt

    // Store in local storage for access in the chatbot
    chrome.storage.local.set({
      lastScrapedContent: data.content,
      lastScrapedUrl: data.url,
      lastScrapedTitle: data.title,
      lastScrapedTime: new Date().toISOString(),
    });

    // Create a data URL for plain text
    const dataUrl =
      "data:text/plain;charset=utf-8," + encodeURIComponent(data.content);

    // Create and trigger download
    const downloadId = await chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: false, // Set to true if you want user to choose location
    });

    return { success: true, downloadId };
  } catch (error) {
    console.error("Error scraping content:", error);
    return { success: false, error: error.message };
  }
}

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
    const contex = request.context || "";

    const openAIKey = "";

    const requestBody = {
      model: model,
      prompt: question,
      max_tokens: 150,
      temperature: 0.7,
      stop: null,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`,
    };

    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.choices && data.choices.length > 0) {
          const answer = data.choices[0].text.trim();
          sendResponse({ answer: answer });
        } else {
          sendResponse({ answer: "Sorry, I couldn't get a response." });
        }
      })
      .catch((error) => {
        console.error("Error calling OpenAI API:", error);
        sendResponse({ answer: "There was an error with the AI request." });
      });

    return true; // Required for async sendResponse
  }

  if (request.action === "scrapeCurrentPage") {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs && tabs[0]) {
        const result = await scrapeAndSaveContent(tabs[0].id, tabs[0].url);
        sendResponse(result);
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true; // Required for async sendResponse
  }
});

// Optional: Auto-scrape when tab completes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if auto-scraping is enabled in settings (you could add this setting)
  chrome.storage.local.get(["autoScrapeEnabled"], (result) => {
    if (result.autoScrapeEnabled && changeInfo.status === "complete") {
      scrapeAndSaveContent(tabId, tab.url);
    }
  });
});
