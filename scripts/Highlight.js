const highlightedVideos = [];

const setup = () => {
    setTimeout(() => {
        chrome.storage.sync.get(["hermitcraftHighlightToggle"], result => {
            if (result.hermitcraftHighlightToggle) {
                build();
                highlight("Hermitcraft");
            }
        });

        chrome.storage.sync.get(["highlightToggle"], result => {
            if (result.highlightToggle) {
                build();
            }
        });
    }, 3000);
}

const build = () => {
    //building HTML for the subscription page
    let insertdiv = document.getElementById("center");
    let wrapper = document.createElement("div");
    wrapper.setAttribute("id", "highlight");

    let inputField = document.createElement("input");
    inputField.setAttribute("id", "highlightInput");
    inputField.placeholder = "keyword";
    inputField.setAttribute("onfocus", "this.value=''");
    inputField.setAttribute("style","margin-left: 10px;")

    let inputButton = document.createElement("button");
    inputButton.setAttribute("id", "highlightButton");
    inputButton.innerHTML = "search";

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.innerHTML = "reset";

    wrapper.appendChild(inputField);
    wrapper.appendChild(inputButton);
    wrapper.appendChild(resetButton);

    insertdiv.appendChild(wrapper);

    //eventlisteners for buttons or keypresses
    inputButton.addEventListener("click", buttonClicked => {
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
    })
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