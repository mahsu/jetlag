const calTzSelectorName = ".naku7c";
const calTzSelectorContainerName = ".yEkFYd.NzA7xc div";
const calSelectedOptionClass = ".KKjvXb";
const tertiaryCalTzSelectorId = "#tertiary";

const tzSelectorCount = () => {
    return document.querySelector(calTzSelectorContainerName).childNodes.length;
}

const getSelectedTz = () => {
    const selected = document.querySelector(`${tertiaryCalTzSelectorId} ${calSelectedOptionClass}`);
    if (!selected) {
        return null;
    }
    let tzName = selected.getAttribute("data-value");
    if (tzName.includes("suggestion:")) {
        tzName = tzName.split(":")[1];
    }
    return {
        label: selected.lastChild.textContent,
        tzName
    }
}

const addNewTzSelector = () => {
    const calTzSelector = document.querySelector(calTzSelectorName);
    const newCalTzSelector = calTzSelector.cloneNode(true);
    newCalTzSelector.style.margin = "8px 0 0 0";
    newCalTzSelector.querySelector(".LGMdbc").textContent = "Tertiary time zone";
    newCalTzSelector.id = tertiaryCalTzSelectorId.substring(1);
    // Clear angular binding
    newCalTzSelector.querySelector(".nDQJrc div").setAttribute("jscontroller", "");
    document.querySelector(calTzSelectorContainerName).appendChild(newCalTzSelector);
}

class CalSettingsObserver {

    constructor() {
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        this.observer = new MutationObserver((mutations, observer) => {
            const calTzSelector = document.querySelector(calTzSelectorName);
            if (!calTzSelector) {
                return;
            }
            if (tzSelectorCount() < MAX_TIMEZONES) {
                addNewTzSelector();
            }
            console.log(getSelectedTz());
        });
    }

    start() {

        // define what element should be observed by the observer
        // and what types of mutations trigger the callback
        this.observer.observe(document, {
            subtree: true,
            attributes: true,
        });
    }

    stop() {
        this.observer.disconnect();
    }
} 