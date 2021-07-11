const setup = () => {
    chrome.storage.sync.get(["playlistRemovePopupToggle"], result => {
        if (result.playlistRemovePopupToggle) {
            let videos = document.getElementsByTagName("ytd-playlist-panel-video-renderer")
            changeDotsToTrashcan(videos);

            for (let i = 0; i < videos.length; i++) {
                videos[i].addEventListener('click', deleteVideo, false);
            }
        }
    });
}

const changeDotsToTrashcan = (videos) => {
    for (let i = 0; i < videos.length; i++) {
        let vector = videos[i].children[1].children[0].children[1].children[0].children[0].children[0].children[0].children[0];

        vector.setAttribute("d", "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z")
    }
}

const deleteVideo = (event) => {
    if (event.target.tagName === "YT-ICON") {
        let menu = document.getElementsByTagName("tp-yt-iron-dropdown")[0].children[0].children[0].children[0].children

        let i = 0;
        let found = false;
        while (!found && i < menu.length) {
            if (menu[i].children[0].children[1].innerHTML === "Remove from playlist") {
                menu[i].children[0].click()
            }
            i++;
        }
    }
}

window.addEventListener("load", setup);