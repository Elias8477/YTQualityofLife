let videoElement;
let playlistAutoplayDisabledInitialized = false;

const PlaylistAutoplayDisabledSetup = () => {
    if (playlistAutoplayDisabledInitialized) return;
    playlistAutoplayDisabledInitialized = true;

    console.log("PlaylistAutoplayDisabled Enabled");
    videoElement = document.getElementsByTagName("video")[document.getElementsByTagName("video").length-1];

    setInterval(() => {
        let totalTime = videoElement.duration;
        let currentTime = videoElement.currentTime;
        let timeLeft = totalTime - currentTime;

        // console.log(timeLeft);

        if (timeLeft <= 1) {
            videoElement.pause();
        }
    }, 1000);
}