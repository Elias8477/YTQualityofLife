let currentTimeElement;
let videoElement;
let currentTime = 5;
let totalTime = 0;
let timerActive = false;

const PlaylistAutoplayDisabledSetup = () => {
    console.log("PlaylistAutoplayDisabled Enabled");
    currentTimeElement = document.getElementsByClassName("ytp-time-current")[0];
    videoElement = document.getElementsByTagName("video")[0];
    totalTime = convertToSeconds(document.getElementsByClassName("ytp-time-duration")[0].innerHTML);
    setPlaylistAutoplayDisabledObservers();
    checkVideoStatus();
}

const setPlaylistAutoplayDisabledObservers = () => {
    //observer to detect playtime change
    new MutationObserver((mutationsList) => {
        currentTime = convertToSeconds(mutationsList[0].target.innerText);
    }).observe(currentTimeElement, { characterData: true, childList: true });
}

const checkVideoStatus = () => {
    checkTimeLeft();
    timerActive = true;

    videoElement.addEventListener("play", (event) => {
        console.log(event)
        if (timerActive == false) {
            timerActive = true;
            checkTimeLeft();
        }
    });

    videoElement.addEventListener("pause", () => {
        timerActive = false;
    });
}

const checkTimeLeft = () => {
    setTimeout(() => {
        let timeLeftInSeconds = totalTime - currentTime;

        // console.log("totalTime: " + totalTime);
        // console.log("currentTime: " + currentTime);
        console.log("timeLeft: " + timeLeftInSeconds);
        currentTime++;

        // if (timeLeftInSeconds <= 2) {
        //     videoElement.pause();
        //     timerActive = false;
        // }

        if (timerActive) checkTimeLeft();
    }, 1000);
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