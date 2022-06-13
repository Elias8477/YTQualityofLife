let timeWrapperElement;
let timeLeftShown = false;

const VideoTimeLeftSetup = () => {
    if (document.querySelector(".ytp-time-left") != null) return;

    console.log("VideoTimeLeft Enabled");
    createHTML();
    updateTimeLeft();
    checkWhichElementToHide();
    setVideoTimeLeftObserver();
    setClickListener();
}

const createHTML = () => {
    timeWrapperElement = document.querySelectorAll(".ytp-time-duration");
    timeWrapperElement = timeWrapperElement[timeWrapperElement.length - 1].parentElement;
    let timeLeftElement = document.createElement("span");

    timeLeftElement.setAttribute("class", "ytp-time-left");
    timeWrapperElement.insertBefore(timeLeftElement, timeWrapperElement.children[0]);

    //add class to existing span for custom css
    document.querySelector(".ytp-time-left").parentElement.classList.add("videoTimeLeftCSS");
}

const updateTimeLeft = () => {
    let videoElement = document.getElementsByTagName("video")[document.getElementsByTagName("video").length - 1];
    let totalTime = videoElement.duration;
    let currentTime = videoElement.currentTime;
    let playbackSpeed = videoElement.playbackRate;
    let timeLeft = "-" + format((totalTime - currentTime) / playbackSpeed);

    if (timeLeft.includes("NaN")) return;
    document.querySelector(".ytp-time-left").innerHTML = timeLeft;
}

const checkWhichElementToHide = () => {
    chrome.storage.sync.get("VideoTimeLeftShown", item => {
        if (item.VideoTimeLeftShown) {
            timeWrapperElement.querySelector(".ytp-time-current").classList.add("hidden");
        } else {
            timeWrapperElement.querySelector(".ytp-time-left").classList.add("hidden");
        }
    })
}

const setVideoTimeLeftObserver = () => {
    let videoCurrentTimeElement = timeWrapperElement.querySelector(".ytp-time-current");
    new MutationObserver(() => {
        updateTimeLeft();
    }).observe(videoCurrentTimeElement, { childList: true });
}

const setClickListener = () => {
    timeWrapperElement.addEventListener("click", () => {
        document.querySelector(".ytp-time-current").classList.toggle("hidden");
        document.querySelector(".ytp-time-left").classList.toggle("hidden");

        //save UI state to reload on the next video / page refresh
        timeLeftShown = !timeLeftShown
        chrome.storage.sync.set({ ["VideoTimeLeftShown"]: timeLeftShown })
    });
}