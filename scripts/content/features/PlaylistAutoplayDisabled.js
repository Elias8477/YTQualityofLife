let playlistAutoplayDisabledInitialized = false;
let alreadyPaused = false;

const PlaylistAutoplayDisabledSetup = () => {
    alreadyPaused = false;
    if (playlistAutoplayDisabledInitialized) return;
    playlistAutoplayDisabledInitialized = true;

    console.log("PlaylistAutoplayDisabled Enabled");
    let videoElement = document.getElementsByTagName("video")[document.getElementsByTagName("video").length - 1];

    setInterval(() => {
        let totalTime = videoElement.duration;
        let currentTime = videoElement.currentTime;
        let timeLeft = totalTime - currentTime;

        // console.log(timeLeft);

        if (timeLeft <= 1 && !alreadyPaused) {
            videoElement.pause();
            alreadyPaused = true;
        }
    }, 300);
}