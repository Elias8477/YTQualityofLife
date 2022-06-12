let videoElement;
let videoTimeLeftInitialized = false;

const VideoTimeLeftSetup = () => {
    if (videoTimeLeftInitialized) return;
    videoTimeLeftInitialized = true;

    console.log("VideoTimeLeft Enabled");
    videoElement = document.getElementsByTagName("video")[document.getElementsByTagName("video").length - 1];
    let timeWrapperElement = document.querySelector(".ytp-time-duration").parentElement;
    let timeLeftElement = document.createElement("span");
    
    timeLeftElement.setAttribute("class", "ytp-time-left hidden");
    timeWrapperElement.insertBefore(timeLeftElement, timeWrapperElement.children[0]);

    setVideoTimeLeftObserver();
    setClickListener();
}

const updateTimeLeft = () => {
    let totalTime = videoElement.duration;
    let currentTime = videoElement.currentTime;
    let timeLeft = "-" + format(totalTime - currentTime);

    document.querySelector(".ytp-time-left").innerHTML = timeLeft;
}

const setVideoTimeLeftObserver = () => {
    let videoCurrentTimeElement = document.querySelector(".ytp-time-current");
    new MutationObserver(() => {
        updateTimeLeft();
    }).observe(videoCurrentTimeElement, { childList: true });
}

const setClickListener = () => {
    let timeWrapperElement = document.querySelector(".ytp-time-duration").parentElement;

    timeWrapperElement.addEventListener("click", () => {
        document.querySelector(".ytp-time-current").classList.toggle("hidden");
        document.querySelector(".ytp-time-left").classList.toggle("hidden");
    });
}