const popupSetup = () => {
    loadSettings()
    setPopupEventlisteners();

    //when checkbox is pressed save its state to chrome.storage
    let features = document.getElementsByClassName("feature");
    for (let i = 0; i < features.length; i++) {
        features[i].addEventListener("click", checkSettings);
    }

    document.getElementById("resetButton").addEventListener("click", resetToDefault);
}

const setPopupEventlisteners = () => {
    let features = document.querySelectorAll(".feature");

    for (let i = 0; i < features.length; i++) {
        features[i].parentElement.addEventListener("mouseover", event => {
            let information = document.querySelectorAll(".feature-information")[i].innerHTML
            setInfo(information);
        });

        features[i].parentElement.addEventListener("mouseout", event => {
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

const checkSettings = (event) => {
    let element = event.target
    let id = element.getAttribute("id")
    let hcHighlight = document.getElementById("HermitcraftHighlightToggle")
    let highlight = document.getElementById("HighlightToggle")

    if (id === "HermitcraftHighlightToggle") {
        if (hcHighlight.checked && highlight.checked) {
            highlight.checked = false;
            saveSetting(highlight)
        }
    } else if (id === "HighlightToggle") {
        if (hcHighlight.checked && highlight.checked) {
            hcHighlight.checked = false;
            saveSetting(hcHighlight)
        }
    }

    saveSetting(element)
}

const saveSetting = (element) => {
    let id = element.getAttribute("id");
    chrome.storage.sync.set({ [id]: element.checked })
}

const loadSettings = () => {
    chrome.storage.sync.get(null, items => { //An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
        let allKeys = Object.keys(items);
        for (let i = 0; i < allKeys.length; i++) {
            let key = allKeys[i]

            chrome.storage.sync.get([key], result => {
                if (document.getElementById(key) != null) {
                    document.getElementById(key).checked = result[key];
                }
            });
        }
    });
}

const resetToDefault = () => {
    chrome.storage.sync.clear()

    let features = document.getElementsByClassName("feature");
    for (let i = 0; i < features.length; i++) {
        features[i].checked = false
    }
}

window.addEventListener("load", popupSetup);