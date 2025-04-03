document.addEventListener("DOMContentLoaded", function () {
    const urlDisplay = document.getElementById("url");
    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");

    // Fetch the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            urlDisplay.textContent = tabs[0].url; // Display the URL
        } else {
            urlDisplay.textContent = "No active tab found";
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = sender === "user" ? "alert alert-primary text-end" : "alert alert-secondary";
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.addEventListener("click", () => {
        const userMessage = messageInput.value.trim();
        if (userMessage === "") return;

        addMessage(userMessage, "user");

        // Simulating bot response
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
});
