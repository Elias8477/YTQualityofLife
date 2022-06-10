let videoElement;
let playlistAutoplayDisabledInitialized = false;

const PlaylistAutoplayDisabledSetup = () => {
    if (playlistAutoplayDisabledInitialized) return;
    playlistAutoplayDisabledInitialized = true;

    console.log("PlaylistAutoplayDisabled Enabled");
    videoElement = document.getElementsByTagName("video")[0];

    setInterval(() => {
        if (videoElement == null) videoElement = document.getElementsByTagName("video")[0];
        let totalTime = videoElement.duration;
        let currentTime = videoElement.currentTime;
        let timeLeft = totalTime - currentTime;

        // console.log(timeLeft);

        if (timeLeft <= 2) {
            videoElement.pause();
        }
    }, 1000);
}