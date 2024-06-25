// content.js

(function() {
  // Check if content script is already loaded
  if (window.hasRun) {
    return ;
  }
  window.hasRun = true;

  // Function to send a message to the background script
  function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message);
  }

  // Function to handle messages from the background script
  function handleMessage(request, sender, sendResponse) {
    if (request.action === "extractContent") {
      extractContent();
    }
  }

  // Extract content from the current page
  function extractContent() {
    let pageContent = document.body.innerText || document.body.textContent;
    sendMessageToBackground({ action: "storeContent", content: pageContent });
  }

  // Add listener for messages from the background script
  chrome.runtime.onMessage.addListener(handleMessage);

  // Initial content extraction
  extractContent();
})();
