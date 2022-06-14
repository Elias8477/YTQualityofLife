const popupSetup = () => {
    loadSettings();
    setPopupEventlisteners();
    setAppVersion();

    //when checkbox is pressed save its state to chrome.storage
    let features = document.getElementsByClassName("feature");
    for (let i = 0; i < features.length; i++) {
        features[i].addEventListener("click", saveSetting);
    }

    document.getElementById("resetButton").addEventListener("click", resetToDefault);
}

const loadSettings = () => {
    chrome.storage.local.get(null, items => { //An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
        let allKeys = Object.keys(items);
        for (let i = 0; i < allKeys.length; i++) {
            let key = allKeys[i]

            chrome.storage.local.get([key], result => {
                if (document.getElementById(key) != null) {
                    document.getElementById(key).checked = result[key];
                }
            });
        }
    });
}

const setPopupEventlisteners = () => {
    let features = document.querySelectorAll(".feature");

    for (let i = 0; i < features.length; i++) {
        features[i].parentElement.addEventListener("mouseover", () => {
            let information = document.querySelectorAll(".feature-information")[i].innerHTML
            setInfo(information);
        });

        features[i].parentElement.addEventListener("mouseout", () => {
            clearInfo();
        });
    }
}

const setInfo = (text) => {
    document.querySelectorAll(".info").forEach(element => {
        element.classList.add("hidden");
    })

    let textElement = document.querySelector("#feature-information-location");

    textElement.innerHTML = text;
    textElement.classList.remove("hidden");
}

const clearInfo = () => {
    document.querySelectorAll(".info").forEach(element => {
        element.classList.remove("hidden");
    })

    document.querySelector("#feature-information-location").classList.add("hidden");
}

const setAppVersion = () => {
    let manifest = chrome.runtime.getManifest();
    document.querySelector("#version").innerHTML = `V${manifest.version}`
}

const saveSetting = (event) => {
    let element = event.target
    let id = element.getAttribute("id");
    chrome.storage.local.set({ [id]: element.checked })
}

const resetToDefault = () => {
    chrome.storage.sync.clear();
    chrome.storage.local.clear();

    let features = document.getElementsByClassName("feature");
    for (let i = 0; i < features.length; i++) {
        features[i].checked = false
    }
}

window.addEventListener("load", popupSetup);