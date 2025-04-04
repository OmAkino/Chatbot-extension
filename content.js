function injectChatbot() {
  if (document.getElementById("chatbot-wrapper")) return;

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("chatbot.html");
  iframe.id = "chatbot-wrapper";
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "380px";
  iframe.style.height = "500px";
  iframe.style.border = "none";
  iframe.style.zIndex = "100000";
  iframe.style.borderRadius = "10px";
  iframe.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  document.body.appendChild(iframe);
}

injectChatbot();

document.addEventListener("mouseup", function (event) {
  const selectedText = window.getSelection().toString().trim();
  let existingMenu = document.getElementById("selection-menu");
  if (existingMenu) existingMenu.remove();

  if (selectedText.length > 0) {
    const menu = document.createElement("div");
    menu.id = "selection-menu";
    menu.style.position = "absolute";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY + 10}px`;
    menu.style.background = "white";
    menu.style.border = "1px solid #ccc";
    menu.style.padding = "5px";
    menu.style.borderRadius = "5px";
    menu.style.boxShadow = "0px 2px 5px rgba(0,0,0,0.2)";
    menu.style.display = "flex";
    menu.style.gap = "5px";
    menu.style.zIndex = "999999";

    const summarizeBtn = document.createElement("button");
    summarizeBtn.innerText = "Summarize";
    summarizeBtn.onclick = () => {
      sendToChatbot(selectedText);
      menu.remove();
    };

    const askAiBtn = document.createElement("button");
    askAiBtn.innerText = "Ask AI";
    askAiBtn.onclick = () => {
      sendToChatbot(selectedText);
      menu.remove();
    };

    menu.appendChild(summarizeBtn);
    menu.appendChild(askAiBtn);
    document.body.appendChild(menu);
  }
});

function sendToChatbot(text) {
    injectChatbot();
  
    // Send selected text directly to chatbot iframe (no delay needed)
    chrome.runtime.sendMessage({ action: "updateChatbot", text: text });
  }
  