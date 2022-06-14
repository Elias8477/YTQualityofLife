//
//chrome storage
//
const getLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get([key], (items) => {
                resolve(items);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

const getAllLocalStorage = async () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(null, (items) => { //An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
                resolve(items);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

const setLocalStorage = (key, value) => {
    chrome.storage.local.set({ [key]: value });
}

const getSyncedStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get([key], (items) => {
                resolve(items);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

const getAllSyncedStorage = async () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(null, (items) => { //An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
                resolve(items);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

const setSyncedStorage = (key, value) => {
    chrome.storage.sync.set({ [key]: value });
}

const consoleLogAllStorage = async () => {
    console.log("local storage")
    console.log(await getAllLocalStorage());
    console.log("synced storage")
    console.log(await getAllSyncedStorage());
}


//
//functions used across features
//
const getVideoElement = () => {
    return document.getElementsByTagName("video")[document.getElementsByTagName("video").length - 1];
}

const formatSecondsToHHMMSS = (input) => {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    hours = Math.floor(input / 3600);
    minutes = Math.floor(((input / 3600) - hours) * 60);
    seconds = Math.floor(((((input / 3600) - hours) * 60) - minutes) * 60);

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    if (hours == 0) {
        return `${minutes}:${seconds}`;
    }

    return `${hours}:${minutes}:${seconds}`;
}

//add multiple d strings by seperating them with semicolons
const createSVGElement = (color, dStrings) => {
    dStrings = dStrings.split(";");

    let SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    SVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    SVG.setAttribute("class", "icon");

    for (let i = 0; i < dStrings.length; i++) {
        let SVGPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        SVGPath.setAttributeNS(null, "d", dStrings[i].trim());
        SVGPath.setAttribute("fill", color);

        SVG.appendChild(SVGPath);
    }

    return SVG;
}