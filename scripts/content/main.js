let oldTabUrl = location.href;
let features;

const main = () => {
    console.log("YTQoL loading");
    getAllFeatures();

    setTimeout(() => {
        setUrlChangeListener();
        injectFeatures();
    }, 2000);
}

const setUrlChangeListener = () => {
    setInterval(() => {
        if (location.href != oldTabUrl) {
            oldTabUrl = location.href;
            injectFeatures();
        }
    }, 1000);
}

const getAllFeatures = () => {
    chrome.storage.sync.get(null, (items) => {
        features = items;
    });
}

const injectFeatures = () => {
    if (features.HighlightToggle && oldTabUrl === "https://www.youtube.com/feed/subscriptions") {
        highlightSetup("Highlight");
    }

    if (features.HermitcraftHighlightToggle && oldTabUrl === "https://www.youtube.com/feed/subscriptions") {
        highlightSetup("HermitcraftHighlight");
    }

    if (features.PlaylistAutoplayDisabledToggle && /watch\?v=/.test(oldTabUrl)) {
        PlaylistAutoplayDisabledSetup();
    }

    if (features.PlaylistRemovePopupToggle && /&list=/.test(oldTabUrl)) {
        PlaylistRemovePopupSetup();
    }

    if (features.PlaylistTotalWatchtimeCounterToggle && /&list=/.test(oldTabUrl)) {
        PlaylistTotalWatchtimeCounterSetup();
    }

    if (features.VideoTimeLeftToggle && /watch\?v=/.test(oldTabUrl)) {
        VideoTimeLeftSetup();
    }
}

window.addEventListener("load", main);