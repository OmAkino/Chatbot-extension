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
