const highlightedVideos = [];

const setup = () => {
    chrome.storage.sync.get(["hermitcraftHighlightToggle"], result => {
        if (result.hermitcraftHighlightToggle) {
            buildHTMLinjection();
            hermitcraftHighlight("Hermitcraft");

            let inputButton = document.getElementById("highlightButton");
            let inputField = document.getElementById("highlightInput");
            let resetButton = document.getElementById("resetButton");

            inputButton.addEventListener("click", function () {
                hermitcraftHighlight(inputField.value)
            });

            resetButton.addEventListener("click", resetHighlight);


        }
    });
}

const resetHighlight = () => {
    for (let i = 0; i < highlightedVideos.length; i++) {
        highlightedVideos[i].style.backgroundColor = "";
    }
    highlightedVideos.length = 0; //TODO change this to be more efficient?
}

const buildHTMLinjection = () => {
    let insertdiv = document.getElementById("title-container");
    let wrapper = document.createElement("div");

    let inputField = document.createElement("input");
    inputField.setAttribute("id", "highlightInput");
    inputField.value = "hermitcraft";
    inputField.setAttribute("onfocus", "this.value=''")

    let inputButton = document.createElement("button");
    inputButton.setAttribute("id", "highlightButton");
    inputButton.innerHTML = "click";

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.innerHTML = "reset";

    wrapper.appendChild(inputField);
    wrapper.appendChild(inputButton);
    wrapper.appendChild(resetButton);

    insertdiv.appendChild(wrapper);
}

const hermitcraftHighlight = (keyword) => {
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

chrome.runtime.onMessage.addListener((message) => {
    if (message[0] === "buttonClicked") {
        hermitcraftHighlight(message[1])
    }
});

window.addEventListener("load", setup);