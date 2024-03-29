chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ tertiaryTz: "Europe/London" });
});

chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        if (changeInfo.url) {
            chrome.tabs.sendMessage(tabId, {
                message: 'url-change',
                url: changeInfo.url
            })
        }
    }
);