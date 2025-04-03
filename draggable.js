document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const dragHeader = document.getElementById("drag-header");

    let offsetX = 0, offsetY = 0, isDragging = false;

    dragHeader.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - chatContainer.offsetLeft;
        offsetY = event.clientY - chatContainer.offsetTop;
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        chatContainer.style.left = `${event.clientX - offsetX}px`;
        chatContainer.style.top = `${event.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
});
