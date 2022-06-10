const PlaylistTotalWatchtimeCounterSetup = () => {
    console.log("PlaylistTotalWatchtimeCounter Enabled");

    setTimeout(() => {
        let totalSeconds = format(getTotalTimeStatusInSeconds() /* / getPlaybackSpeed() */);
        addToPage(totalSeconds);
        setPlaylistTotalWatchtimeCounterObservers();
    }, 5000);
}

const setPlaylistTotalWatchtimeCounterObservers = () => {
    //observing when video gets added or removed from playlist
    const videoWrapper = document.getElementsByTagName("ytd-playlist-panel-video-renderer")[0].parentElement;
    new MutationObserver(() => {
        totalSeconds = format(getTotalTimeStatusInSeconds() /* / getPlaybackSpeed() */);
        addToPage(totalSeconds);
    }).observe(videoWrapper, { childList: true });

    //observing when URL changes, page partially refreshes
    let lastUrl = location.href;
    new MutationObserver(() => {
        setTimeout(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;

                totalSeconds = format(getTotalTimeStatusInSeconds() /* / getPlaybackSpeed() */);
                addToPage(totalSeconds);
            }
        }, 5000);
        //TODO when refactoring to injection.js remove this observer because url change is observed there
    }).observe(document, { subtree: true, childList: true });
}

const getTotalTimeStatusInSeconds = () => {
    let videos = document.getElementsByTagName("ytd-playlist-panel-video-renderer");
    let totalSeconds = 0;

    for (let i = 0; i < videos.length; i++) {
        let currentVideoTimeStatus = videos[i].querySelector(`span[id^="text"]`);

        if (currentVideoTimeStatus == null) {
            console.log("Error loading Time status. Either the playlist is too large or your internet connection too slow.");
        } else {
            let splitTimeStatus = currentVideoTimeStatus.innerHTML.split(":").reverse();

            for (let j = 0; j < splitTimeStatus.length; j++) {
                if (j == 0) {
                    totalSeconds += parseInt(splitTimeStatus[j].trim());
                } else {
                    totalSeconds += parseInt(splitTimeStatus[j].trim()) * (60 * j);
                }
            }
        }
    }

    return totalSeconds;
}

const getPlaybackSpeed = () => {
    // return document.getElementsByClassName("video-stream html5-main-video")[0].playbackRate;
}

const format = (input) => {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    hours = Math.floor(input / 3600);
    minutes = Math.floor(((input / 3600) - hours) * 60);
    seconds = Math.floor(((((input / 3600) - hours) * 60) - minutes) * 60);

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    if (hours == 0) {
        return `${minutes}:${seconds}`;
    }

    return `${hours}:${minutes}:${seconds}`;
}

const addToPage = (totalTime) => {
    let playlistPanelTitle = document.getElementsByClassName("title style-scope ytd-playlist-panel-renderer complex-string")[0].children[0];

    playlistPanelTitle.innerHTML = `${playlistPanelTitle.innerHTML} (${totalTime})`;
}