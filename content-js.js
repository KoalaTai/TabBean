// Function to extract page content
function extractPageContent() {
  return {
    title: document.title,
    content: document.body.innerText,
    url: window.location.href
  };
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    sendResponse(extractPageContent());
  } else if (request.action === 'displayMessage') {
    displayMessage(request.message);
  }
});

// Function to display messages (e.g., from other tabs)
function displayMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    z-index: 9999;
  `;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 5000);
}

// Send page content to background script when loaded
chrome.runtime.sendMessage({
  action: 'pageLoaded',
  content: extractPageContent()
});
