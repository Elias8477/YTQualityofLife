let oldTabUrl = location.href;
let features = {
    Highlight: false,
    HermitcraftHighlight: false,
    PlaylistAutoplayDisabled: false,
    PlaylistRemovePopup: false,
    PlaylistTotalWatchtimeCounter: false
}

const main = () => {
    console.log("YTQoL loading");
    getAllActiveFeatures();

    setTimeout(() => {
        setUrlChangeListener();
        injectFeatures();
    }, 2000);
}

const setUrlChangeListener = () => {

    setInterval(() => {
        if (location.href != oldTabUrl) {
            oldTabUrl = location.href;
            //TODO remove console log
            console.log("url changed!")
            injectFeatures();
        }
    }, 1000);
}

const getAllActiveFeatures = () => {
    chrome.storage.sync.get(["HermitcraftHighlightToggle"], result => {
        if (result.HermitcraftHighlightToggle) {
            features.HermitcraftHighlight = true;
        }
    });

    chrome.storage.sync.get(["HighlightToggle"], result => {
        if (result.HighlightToggle) {
            features.Highlight = true;
        }
    });

    chrome.storage.sync.get(["PlaylistAutoplayDisabledToggle"], result => {
        if (result.PlaylistAutoplayDisabledToggle) {
            features.PlaylistAutoplayDisabled = true;
        }
    });

    chrome.storage.sync.get(["PlaylistRemovePopupToggle"], result => {
        if (result.PlaylistRemovePopupToggle) {
            features.PlaylistRemovePopup = true;
        }
    });

    chrome.storage.sync.get(["PlaylistTotalWatchtimeCounterToggle"], result => {
        if (result.PlaylistTotalWatchtimeCounterToggle) {
            features.PlaylistTotalWatchtimeCounter = true;
        }
    });
}

const injectFeatures = () => {
    if (features.Highlight && oldTabUrl === "https://www.youtube.com/feed/subscriptions") {
        highlightSetup("Highlight");
    }

    if (features.HermitcraftHighlight && oldTabUrl === "https://www.youtube.com/feed/subscriptions") {
        highlightSetup("HermitcraftHighlight");
    }

    if (features.PlaylistAutoplayDisabled && /watch\?v=/.test(oldTabUrl)) {
        PlaylistAutoplayDisabledSetup();
    }

    if (features.PlaylistRemovePopup && /&list=/.test(oldTabUrl)) {
        PlaylistRemovePopupSetup();
    }

    if (features.PlaylistTotalWatchtimeCounter && /&list=/.test(oldTabUrl)) {
        PlaylistTotalWatchtimeCounterSetup();
    }
}

window.addEventListener("load", main);