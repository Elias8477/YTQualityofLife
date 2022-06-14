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
