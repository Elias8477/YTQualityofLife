const currentTimeElement = document.getElementsByClassName("ytp-time-current")[0];
const videoElement = document.getElementsByTagName("video")[0];
let currentTime = 0;
let totalTime = 0;
let interval = false;

const PlaylistAutoplayDisabledSetup = () => {
    chrome.storage.sync.get(["PlaylistAutoplayDisabledToggle"], result => {
        if (result.PlaylistAutoplayDisabledToggle) {
            console.log("PlaylistAutoplayDisabled Enabled");

            setPlaylistAutoplayDisabledObservers();
            checkVideoStatus();
        }
    });
}

const setPlaylistAutoplayDisabledObservers = () => {
    //observer to detect playtime change
    new MutationObserver((mutationsList) => {
        currentTime = convertToSeconds(mutationsList[0].target.innerText);
    }).observe(currentTimeElement, { characterData: true, childList: true });
}

const checkVideoStatus = () => {
    if (!interval) interval = setInterval(checkTimeLeft, 1000);

    videoElement.addEventListener("play", () => {
        if (!interval) interval = setInterval(checkTimeLeft, 1000);
    });

    videoElement.addEventListener("pause", () => {
        clearInterval(interval);
        interval = false;
    });
}

const checkTimeLeft = () => {
    totalTime = convertToSeconds(document.getElementsByClassName("ytp-time-duration")[0].innerHTML);
    let timeLeftInSeconds = totalTime - currentTime;

    // console.log("totalTime: " + totalTime);
    // console.log("currentTime: " + currentTime);
    // console.log("timeLeft: " + timeLeftInSeconds);
    currentTime++;

    if (timeLeftInSeconds <= 2) {
        videoElement.pause();
    }
}

const convertToSeconds = (time) => {
    let totalSeconds = 0;

    let splitTimeStatus = time.split(":").reverse();

    for (let i = 0; i < splitTimeStatus.length; i++) {
            if (i == 0) {
                totalSeconds += parseInt(splitTimeStatus[i].trim());
            } else if (i == 1) {
                totalSeconds += parseInt(splitTimeStatus[i].trim()) * (60 * i);
            } else {
                totalSeconds += parseInt(splitTimeStatus[i].trim()) * (3600 * i);
            }
    }

    return totalSeconds;
}

window.addEventListener("load", PlaylistAutoplayDisabledSetup);