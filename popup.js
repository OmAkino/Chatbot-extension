document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enableChatbot');
  const modelSelect = document.getElementById('aiModel');
  const scrapeButton = document.getElementById('scrapeButton');
  const scrapeStatus = document.getElementById('scrapeStatus');
  const autoScrapeToggle = document.getElementById('autoScrape');
  
  // Load saved settings
  chrome.storage.local.get(['isEnabled', 'selectedModel', 'autoScrapeEnabled', 'lastScrapedTime'], (result) => {
    if (typeof result.isEnabled !== 'undefined') {
      enableToggle.checked = result.isEnabled;
    }
    
    if (result.selectedModel) {
      modelSelect.value = result.selectedModel;
    }
    
    if (typeof result.autoScrapeEnabled !== 'undefined') {
      autoScrapeToggle.checked = result.autoScrapeEnabled;
    }
    
    // Show last scrape time if available
    if (result.lastScrapedTime) {
      const date = new Date(result.lastScrapedTime);
      scrapeStatus.textContent = `Last scraped: ${date.toLocaleString()}`;
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

  // Auto-scrape toggle
  autoScrapeToggle.addEventListener('change', () => {
    const autoScrapeEnabled = autoScrapeToggle.checked;
    chrome.storage.local.set({ 'autoScrapeEnabled': autoScrapeEnabled });
  });
  
  // Handle scrape button click
  scrapeButton.addEventListener('click', () => {
    scrapeButton.disabled = true;
    scrapeStatus.className = 'status';
    scrapeStatus.textContent = 'Scraping...';
    
    chrome.runtime.sendMessage({ action: "scrapeCurrentPage" }, (response) => {
      scrapeButton.disabled = false;
      
      if (response && response.success) {
        scrapeStatus.className = 'status success';
        scrapeStatus.textContent = 'Page content saved successfully!';
        
        // Get the current time
        chrome.storage.local.get(['lastScrapedTime'], (result) => {
          if (result.lastScrapedTime) {
            const date = new Date(result.lastScrapedTime);
            scrapeStatus.textContent += ` (${date.toLocaleString()})`;
          }
        });
      } else {
        scrapeStatus.className = 'status error';
        scrapeStatus.textContent = `Error: ${response ? response.error : 'Unknown error'}`;
      }
    });
  });
});