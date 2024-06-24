import { Readability } from '@mozilla/readability';
import browser from 'webextension-polyfill';

class ContentScript {
  constructor() {
    this.setupMessageListener();
  }

  setupMessageListener() {
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'extractContent') {
        sendResponse(this.extractPageContent());
      } else if (request.action === 'displayMessage') {
        this.displayMessage(request.message);
      }
    });
  }

  extractPageContent() {
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    return {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      byline: article.byline,
      url: window.location.href,
    };
  }

  displayMessage(message) {
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
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
  }

  extractYouTubeInfo() {
    if (window.location.hostname.includes('youtube.com') && window.location.pathname.includes('/watch')) {
      const videoId = new URLSearchParams(window.location.search).get('v');
      const title = document.querySelector('h1.title').textContent;
      const description = document.querySelector('#description-text').textContent;
      return { videoId, title, description };
    }
    return null;
  }
}

// Initialize the content script
const contentScript = new ContentScript();

// Notify the background script that the content script has been loaded
browser.runtime.sendMessage({ action: 'contentScriptLoaded', url: window.location.href });
