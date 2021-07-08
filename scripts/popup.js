document.addEventListener('DOMContentLoaded', () => {

    const buttonClicked = () => {
        chrome.tabs.query({currentWindow: true, active: true},
            function (tabs) {
            let array = [];
            array.push("buttonClicked");
            array.push(document.getElementById("inputText").value);
                chrome.tabs.sendMessage(tabs[0].id, array)
            })
    }
    document.getElementById("inputClick").addEventListener("click", buttonClicked, false)


})