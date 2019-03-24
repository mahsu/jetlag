const calTzSelectorName = ".naku7c";
const calTzSelectorContainerName = ".yEkFYd.NzA7xc div";
const calSelectedOptionClass = ".KKjvXb";
const tertiaryCalTzSelectorId = "#tertiary";

const tzSelectorCount = () => {
    return document.querySelector(calTzSelectorContainerName).childNodes.length;
}

const getTzFromOption = (opt) => {
    let tzName = opt.getAttribute("data-value");
    if (!tzName) {
        return ""
    }
    if (tzName.includes("suggestion:")) {
        tzName = tzName.split(":")[1];
    }
    return tzName;
}

const getSelectedTz = () => {
    const selectedOption = document.querySelector(`${tertiaryCalTzSelectorId} ${calSelectedOptionClass}`);
    if (!selectedOption) {
        return null;
    }
    const tzName = getTzFromOption(selectedOption);
    return {
        label: selectedOption.lastChild.textContent,
        tzName
    }
}

const setSelectedTz = (calNode, desiredTz) => {
    const optionsList = calNode.querySelector(`.ry3kXd`);
    const selectedClassName = calSelectedOptionClass.substring("1");
    const childNodes = Array.from(optionsList.childNodes);
    childNodes.some(opt => {
        if (opt.classList.contains(selectedClassName)) {
            opt.classList.remove(selectedClassName);
            opt.setAttribute("aria-selected", false);
            opt.setAttribute("tab-index", -1);
            return true;
        }
    })
    childNodes.some(opt => {
        if (getTzFromOption(opt) === desiredTz) {
            opt.classList.add(selectedClassName);
            opt.setAttribute("aria-selected", true);
            opt.setAttribute("tab-index", 0);
            return true;
        }
    })
}

const addNewTzSelector = (desiredTz) => {
    const calTzSelector = document.querySelector(calTzSelectorName);
    const newCalTzSelector = calTzSelector.cloneNode(true);
    newCalTzSelector.style.margin = "8px 0 0 0";
    newCalTzSelector.querySelector(".LGMdbc").textContent = "Tertiary time zone";
    newCalTzSelector.id = tertiaryCalTzSelectorId.substring(1);

    // Clear angular binding
    newCalTzSelector.querySelector(".nDQJrc div").setAttribute("jscontroller", "");

    setSelectedTz(newCalTzSelector, desiredTz);
    document.querySelector(calTzSelectorContainerName).appendChild(newCalTzSelector);
}

class CalSettingsObserver {

    constructor() {
        chrome.storage.sync.get(['tertiaryTz'], ({ tertiaryTz }) => {
            this.savedTz = tertiaryTz;
        });

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        this.observer = new MutationObserver((mutations, observer) => {
            const calTzSelector = document.querySelector(calTzSelectorName);
            if (!calTzSelector) {
                return;
            }
            if (tzSelectorCount() < MAX_TIMEZONES) {
                if (this.savedTz) {
                    addNewTzSelector(this.savedTz);
                }
            }
            const { tzName } = getSelectedTz();
            if (tzName && tzName !== this.savedTz) {
                chrome.storage.sync.set({ tertiaryTz: tzName });
            }
        });
    }

    start() {
        this.observer.observe(document, {
            subtree: true,
            attributes: true,
        });
    }


    stop() {
        this.observer.disconnect();
    }
} 