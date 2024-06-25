// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refresh');
    refreshButton.addEventListener('click', refreshTabs);

    refreshTabs();
});

function refreshTabs() {
    chrome.tabs.query({}, (tabs) => {
        const tabsList = document.getElementById('tabs');
        tabsList.innerHTML = '';
        tabs.forEach((tab) => {
            const li = document.createElement('li');
            li.textContent = tab.title;
            tabsList.appendChild(li);
        });
    });
}
