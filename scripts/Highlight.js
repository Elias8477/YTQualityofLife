const highlightedVideos = [];
let option;

const setup = () => {
    //checking which option has been selected
    chrome.storage.sync.get(["hermitcraftHighlightToggle"], result => {
        if (result.hermitcraftHighlightToggle) {
            setOption("HermitcraftHighlight");
        }
    });

    chrome.storage.sync.get(["highlightToggle"], result => {
        if (result.highlightToggle) {
            setOption("Highlight");
        }
    });

    setTimeout(() => {
        if (option === "HermitcraftHighlight") {
            highlight("Hermitcraft");
        }

        build();
    }, 3000);
}

const setOption = (o) => {
    option = o;
};

const build = () => {
    //building HTML for the subscription page
    let insertdiv = document.getElementById("guide-inner-content");

    let wrapper = document.createElement("div");
    wrapper.setAttribute("id", "highlight");

    let inputFieldWrapper = document.createElement("div");
    inputFieldWrapper.setAttribute("id", "highlightInputWrapper");

    let inputField = document.createElement("input");
    inputField.setAttribute("id", "highlightInput");
    inputField.placeholder = "keyword";
    inputField.setAttribute("onfocus", "this.value=''");
    inputFieldWrapper.appendChild(inputField);

    let inputButton = document.createElement("button");
    inputButton.setAttribute("id", "highlightButton");
    inputButton.setAttribute("class", "button");
    inputButton.innerHTML = "Highlight";

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.setAttribute("class", "button");
    resetButton.innerHTML = "reset";

    let hermitcraftButton = document.createElement("button");
    hermitcraftButton.setAttribute("id", "hermitcraftButton");
    hermitcraftButton.setAttribute("class", "button");
    hermitcraftButton.innerHTML = "Hermitcraft";

    wrapper.appendChild(inputFieldWrapper);
    wrapper.appendChild(inputButton);
    wrapper.appendChild(resetButton);
    if (option === "HermitcraftHighlight") wrapper.appendChild(hermitcraftButton);

    insertdiv.insertBefore(wrapper, insertdiv.firstChild);

    //eventlisteners for buttons or keypresses
    inputButton.addEventListener("click", () => {
        highlight(inputField.value)
        inputField.value = ""
    });

    resetButton.addEventListener("click", resetHighlight);

    inputField.addEventListener("keyup", event => {
        event.preventDefault();
        if (event.key === "Enter") {
            highlight(inputField.value);
            inputField.value = ""
        }
    });

    if (option === "HermitcraftHighlight") hermitcraftButton.addEventListener("click", () => highlight("Hermitcraft"));
}

const highlight = (keyword) => {
    //wrapper with junk
    let videoListWrapperJunk = document.getElementsByClassName("style-scope ytd-section-list-renderer");

    //only add wrappers which have videos
    let videoListWrapper = []

    for (let i = 0; i < videoListWrapperJunk.length; i++) {
        if (videoListWrapperJunk[i].getAttribute("id") == null) {
            videoListWrapper.push(videoListWrapperJunk[i])
        }
    }
    videoListWrapper.pop()

    //add all videos, of all wrappers, in one array
    let videosPerWrapper = [];

    for (let i = 0; i < videoListWrapper.length; i++) {
        videosPerWrapper.push(videoListWrapper[i].childNodes[5].children[0].children[0].children[1].children[0].children[1].children)

    }

    let currentVideo = "";
    let videotitel = "";
    let videotitelsplit = "";

    for (let i = 0; i < videosPerWrapper.length; i++) {
        for (let j = 0; j < videosPerWrapper[i].length; j++) {
            currentVideo = videosPerWrapper[i][j]
            videotitel = currentVideo.children[0].children[1].children[0].children[0].children[1].ariaLabel;
            videotitelsplit = videotitel.split(" ");
            let titelContainsKeyword = false;
            let k = 0;
            while (!titelContainsKeyword && k < videotitelsplit.length) {
                if (videotitelsplit[k].toLowerCase() === keyword.toLowerCase()) {
                    titelContainsKeyword = true;

                    currentVideo.style.backgroundColor = "red";
                    highlightedVideos.push(currentVideo);
                }
                k++
            }
        }
    }
}

const resetHighlight = () => {
    for (let i = 0; i < highlightedVideos.length; i++) {
        highlightedVideos[i].style.backgroundColor = "";
    }
    highlightedVideos.length = 0;
}

window.addEventListener("load", setup);