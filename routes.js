const calPage = new CalPageOberver();
const calSettings = new CalSettingsObserver();

const onNavigate = (newUrl) => {
    calPage.stop();
    calSettings.stop();
    if (newUrl.includes("/r/settings")) {
        calSettings.start();
    }
    else if (newUrl.includes("/r")) {
        calPage.start();
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'url-change') {
        onNavigate(request.url);
    }
});

onNavigate(window.location.href);