const setup = () => {
    loadSettings()

    //when checkbox is pressed save its state to chrome.storage
    document.getElementById("wrapper").addEventListener("click", click => {
        let element = click.target;

        if (element.getAttribute("type") === "checkbox") {
            saveSetting(element)
        }
    })
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

const saveSetting = (element) => {
    let id = element.getAttribute("id");
    chrome.storage.sync.set({[id]: element.checked})
    console.log(`key: ${id} has the value: ${element.checked}`)
}

window.addEventListener("load", setup);