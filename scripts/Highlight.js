let highlightedVideos = new Map();
let keywords = [];
let option;
let sectionRenderListLength = 1;

const highlightSetup = () => {
    //checking which option has been selected
    chrome.storage.sync.get(["HermitcraftHighlightToggle"], result => {
        if (result.HermitcraftHighlightToggle) {
            setOption("HermitcraftHighlight");
        }
    });

    chrome.storage.sync.get(["HighlightToggle"], result => {
        if (result.HighlightToggle) {
            setOption("Highlight");
        }
    });

    setTimeout(() => {
        if (option != undefined) buildHTML();
        if (option === "HermitcraftHighlight") highlight("hermitcraft");

        setHighlightObservers();
    }, 3000);
}

const setOption = (o) => {
    option = o;
}

const setHighlightObservers = () => {
    //when new content is loaded by scrolling down, observer triggers and highlights newly loaded videos
    let sectionRendererList = document.getElementById("contents");
    new MutationObserver(() => {
        //prevent multiple triggers by checking if the list actually grew
        if (sectionRenderListLength < sectionRendererList.children.length) {
            sectionRenderListLength = sectionRendererList.children.length

            //get all keywords and re-highlight
            keywords.forEach(keyword => highlight(keyword));
        }
    }).observe(sectionRendererList, { childList: true });
}

const buildHTML = () => {
    console.log("Highlight Enabled");

    //building HTML for the subscription page
    let insertdiv = document.getElementById("guide-inner-content");

    let breakLine = document.createElement("hr");
    breakLine.setAttribute("id", "highlightBreakLine");
    insertdiv.insertBefore(breakLine, insertdiv.firstChild);

    let wrapper = document.createElement("div");
    wrapper.setAttribute("id", "highlight");
    insertdiv.insertBefore(wrapper, insertdiv.firstChild);

    let gridWrapper = document.createElement("div");
    gridWrapper.setAttribute("id", "gridWrapper");
    wrapper.appendChild(gridWrapper);

    let inputField = document.createElement("input");
    inputField.setAttribute("id", "highlightInput");
    inputField.placeholder = "keyword";
    inputField.setAttribute("onfocus", "this.value=\"\"");
    gridWrapper.appendChild(inputField);


    //search button
    let searchButton = document.createElement("button");
    searchButton.setAttribute("id", "highlightButton");
    searchButton.setAttribute("class", "button");

    let searchIcon = createIcon("#ffffff", "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z");
    searchButton.appendChild(searchIcon);

    let searchText = document.createElement("p");
    searchText.innerHTML = "Search";
    searchText.setAttribute("class", "buttonText");
    searchButton.appendChild(searchText);
    gridWrapper.appendChild(searchButton);


    //reset button
    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.setAttribute("class", "button");

    let resetIcon = createIcon("#ffffff", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z; M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z");
    resetButton.appendChild(resetIcon)

    let resetText = document.createElement("p");
    resetText.innerHTML = "Reset";
    resetText.setAttribute("class", "buttonText");
    resetButton.appendChild(resetText);
    gridWrapper.appendChild(resetButton);


    //hermitcraft button
    let hermitcraftButton = document.createElement("button");
    hermitcraftButton.setAttribute("id", "hermitcraftButton");
    hermitcraftButton.setAttribute("class", "button");
    hermitcraftButton.innerHTML = "Hermitcraft";
    if (option === "HermitcraftHighlight") gridWrapper.appendChild(hermitcraftButton);


    //eventlisteners for buttons or keypresses
    inputField.addEventListener("keyup", event => {
        event.preventDefault();
        if (event.key === "Enter") {
            let keywordsInput = inputField.value.toLowerCase().split(" ").filter(Boolean);
            keywordsInput.forEach(keyword => highlight(keyword));
            inputField.value = ""
        }
    });

    searchButton.addEventListener("click", () => {
        let keywordsInput = inputField.value.toLowerCase().split(" ").filter(Boolean);
        keywordsInput.forEach(keyword => highlight(keyword));
        inputField.value = ""
    });

    resetButton.addEventListener("click", resetHighlight);

    if (option === "HermitcraftHighlight") hermitcraftButton.addEventListener("click", () => highlight("hermitcraft"));


    //keyword list
    let keywordListWrapper = document.createElement("div");
    keywordListWrapper.setAttribute("id", "keywordListWrapper");
    wrapper.appendChild(keywordListWrapper);

    let keywordList = document.createElement("ul");
    keywordList.setAttribute("id", "keywordList");
    keywordListWrapper.appendChild(keywordList);

    keywordList.addEventListener("click", (event) => unhighlight(event.target));
}

//add multiple d strings by seperating them with semicolons
const createIcon = (color, dStrings) => {
    dStrings = dStrings.split(";");

    let SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    SVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    SVG.setAttribute("class", "icon");

    for (let i = 0; i < dStrings.length; i++) {
        let SVGPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        SVGPath.setAttributeNS(null, "d", dStrings[i].trim());
        SVGPath.setAttribute("fill", color);

        SVG.appendChild(SVGPath);
    }

    return SVG;
}

const highlight = (keyword) => {
    let videos = document.getElementsByTagName("ytd-grid-video-renderer");

    let currentVideo = "";
    let videoTitle = "";
    let videoTitleWordsArray = "";

    for (let i = 0; i < videos.length; i++) {
        currentVideo = videos[i]
        videoTitle = currentVideo.querySelector(`a[id^="video-title"]`).innerHTML;
        videoTitleWordsArray = videoTitle.split(" ").map(word => word.toLowerCase());
        let titleContainsKeyword = false;
        let j = 0;

        while (!titleContainsKeyword && j < videoTitleWordsArray.length) {
            if (videoTitleWordsArray[j] === keyword) {
                titleContainsKeyword = true;
                currentVideo.style.backgroundColor = "red";

                let list = highlightedVideos.get(currentVideo);
                if (list == null) {
                    list = [keyword];
                } else if (list.includes(keyword)) { }
                else {
                    list.push(keyword);
                }
                highlightedVideos.set(currentVideo, list);
            }
            j++
        }
    }

    addHighlightedWordToWrapper(keyword);
    updateKeywordCount();
    //TODO remove console logs
    console.log(highlightedVideos)
    console.log(keywords)
}

const addHighlightedWordToWrapper = (currentKeyword) => {
    let keywordListWrapper = document.getElementById("keywordList");
    let keywordList = document.querySelectorAll(".keyword");
    let exists = false

    keywordList.forEach(keyword => {
        if (keyword.innerHTML === currentKeyword) exists = true;
    })

    if (exists) return

    let keywordElement = document.createElement("li");
    keywordElement.setAttribute("class", "keyword");
    keywordElement.setAttribute("data-count", "0");
    keywordElement.innerHTML = currentKeyword
    keywordListWrapper.appendChild(keywordElement);
    keywords.push(currentKeyword);
}

const unhighlight = (target) => {
    //TODO remove console log
    // console.log(highlightedVideos)
    keyword = target.innerHTML;

    //search videos where title matches current keyword and does not match any other keywords
    highlightedVideos.forEach((keywords, video) => {
        //delete keyword
        for (var j = 0; j < keywords.length; j++) {
            if (keywords[j] === keyword) {
                keywords.splice(j, 1);
            }
        }

        //check if array is empty and unhighlight
        if (keywords.length === 0) {
            video.style.backgroundColor = "";
            highlightedVideos.delete(video);
        }
    })

    //remove <li> from the HTML keyword wrapper
    target.remove();
    keywords = keywords.filter(k => k !== keyword)
    updateKeywordCount();
}

const resetHighlight = () => {
    Array.from(highlightedVideos.keys()).forEach(video => video.style.backgroundColor = "");
    highlightedVideos.clear();
    keywords.length = 0;
    document.getElementById("keywordList").innerHTML = "";
}

const updateKeywordCount = () => {
    let count = getKeywordCount();
    let keywordList = document.querySelectorAll(".keyword");

    keywordList.forEach(keywordElement => {
        let keyword = keywordElement.innerHTML;
        let keywordCount = count.get(keyword);

        if (keywordCount == null) keywordCount = 0;

        keywordElement.setAttribute("data-count", keywordCount);
    })
}

const getKeywordCount = () => {
    let count = new Map();
    let ArrayWithKeywordsArrays = Array.from(highlightedVideos.values());
    ArrayWithKeywordsArrays.forEach(keywordsArray => {
        keywordsArray.forEach(keyword => {

            if (count.has(keyword)) {
                count.set(keyword, (count.get(keyword)) + 1)
            } else {
                count.set(keyword, 1);
            }
        });
    });

    return count;
}

window.addEventListener("load", highlightSetup);