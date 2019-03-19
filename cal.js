const MAX_TIMEZONES = 3;
const DESIRED_TZ = "GMT";
const dt = luxon.DateTime.local();

var calBody, tzTimesContainer, calHeader, hiddenTzHeader, visibleTzHeader;

const initRefs = () => {
    calBody = document.querySelector(".G5v83e.elYzab-DaY83b-ppHlrf.J2aUD");
    tzTimesContainer = calBody.querySelector(".sx5BGe");

    calHeader = document.querySelector(".NBzXR");
    hiddenTzHeader = calHeader.querySelector(".ALy9T");
    visibleTzHeader = calHeader.querySelector(".nL44Lb");
}

const tzCount = () => {
    return tzTimesContainer.childNodes.length
}

const formatAmPm = (hour) => {
    hour = hour % 24;
    if (hour < 0) {
        return `${hour + 12} PM`;
    }
    if (hour == 0) {
        return "12 AM";
    }
    if (hour < 12) {
        return `${hour} AM`
    }
    if (hour == 12) {
        return `${hour} PM`
    }
    return `${hour - 12} PM`
}

const getTzOffset = () => {
    const newTz = dt.setZone(DESIRED_TZ).offset;
    const label = `GMT-${(newTz / 60).toString().padStart(2, "0")}`;
    const localOffset = (newTz - dt.offset) / 60;
    return {
        localOffset,
        label,
    }
}

const setTzHeader = (offsetData) => {
    // Hidden header provides spacing for visible header
    const secondaryHiddenTzHeader = hiddenTzHeader.querySelector(".Pgg38c.Xc6hQ.TzA9Ye");
    const secondaryVisibleTzHeader = visibleTzHeader.querySelector(".Gk2izd");
    const newVisibleHeader = secondaryVisibleTzHeader.cloneNode(true);
    const newHiddenHeader = secondaryHiddenTzHeader.cloneNode(true);
    newVisibleHeader.setAttribute("data-text", offsetData.label);
    newVisibleHeader.firstChild.textContent = offsetData.label;

    visibleTzHeader.insertBefore(newVisibleHeader, secondaryVisibleTzHeader);
    hiddenTzHeader.insertBefore(newHiddenHeader, secondaryHiddenTzHeader);
}

const setTzTimes = (offsetData) => {
    const secondaryTzTimes = tzTimesContainer.querySelector(".GENA3c");
    const newTz = secondaryTzTimes.cloneNode(true);

    // remap existing times
    newTz.childNodes.forEach((child, localHour) => {
        child.firstChild.textContent = formatAmPm(localHour + offsetData.localOffset)
    })
    tzTimesContainer.insertBefore(newTz, secondaryTzTimes);
}

const addTzSidebar = () => {
    const offsetData = getTzOffset();
    setTzHeader(offsetData);
    setTzTimes(offsetData);
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;


var observer = new MutationObserver(function (mutations, observer) {
    // fired when a mutation occurs
    console.log(mutations, observer);

    initRefs();

    if (tzCount() < MAX_TIMEZONES) {
        addTzSidebar();
    }
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
    subtree: true,
    attributes: true,
});  