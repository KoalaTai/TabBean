const puppeteer = require('puppeteer');
const axios = require('axios');

async function runPerformanceTests() {
  console.log('Starting performance tests...');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Test extension popup load time
  console.log('Testing extension popup load time...');
  const extensionId = 'your_extension_id'; // Replace with actual extension ID
  const popupUrl = `chrome-extension://${extensionId}/popup.html`;
  const startTime = Date.now();
  await page.goto(popupUrl);
  const loadTime = Date.now() - startTime;
  console.log(`Extension popup load time: ${loadTime}ms`);

  // Test API response times
  console.log('Testing API response times...');
  const apiUrl = 'http://localhost:3000/api'; // Replace with actual API URL
  const endpoints = ['/tabs', '/knowledge-base/search?q=test', '/auth/token'];
  
  for (const endpoint of endpoints) {
    const start = Date.now();
    await axios.get(`${apiUrl}${endpoint}`);
    const responseTime = Date.now() - start;
    console.log(`API response time for ${endpoint}: ${responseTime}ms`);
  }

  // Test knowledge base search performance
  console.log('Testing knowledge base search performance...');
  await page.goto(popupUrl);
  await page.click('#knowledge-base-tab');
  await page.type('#search-input', 'test');
  const searchStartTime = Date.now();
  await page.click('#search-button');
  await page.waitForSelector('#search-results');
  const searchTime = Date.now() - searchStartTime;
  console.log(`Knowledge base search time: ${searchTime}ms`);

  await browser.close();
  console.log('Performance tests completed.');
}

runPerformanceTests();
