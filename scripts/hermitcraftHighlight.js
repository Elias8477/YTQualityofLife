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

    console.log(videosPerWrapper)


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
                if (videotitelsplit[k].toLowerCase() === keyword.toLowerCase()) { //TODO "hermitcraft" terug veranderen naar   keyword
                    console.log(currentVideo);
                    titelContainsKeyword = true;

                    currentVideo.style.backgroundColor = "red";
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