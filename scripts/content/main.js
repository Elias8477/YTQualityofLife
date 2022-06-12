let oldTabUrl = location.href;
let features;

const main = async () => {
    console.log("YTQoL loading");
    features = await getAllFeatures();
    setUrlChangeListener();
    injectFeatures();
}

const setUrlChangeListener = () => {
    setInterval(() => {
        if (location.href != oldTabUrl) {
            oldTabUrl = location.href;
            // console.log("url changed!")
            injectFeatures();
        }
    }, 1000);
}

const getAllFeatures = async () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(null, (items) => {
                resolve(items);
            });
        } catch (ex) {
            reject(ex);
        }
    })
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