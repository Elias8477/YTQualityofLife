let highlightedVideos = new Map();
let keywords = [];
let autoKeywords = [];
let sectionRenderListLength = 0;
let autoHighlightListShown = false;

const highlightSetup = () => {
    if (document.getElementById("highlight") != null) return;

    setTimeout(() => {
        console.log("Highlight Enabled");
        buildHighlightHTML();
        setHighlightObservers();
    }, 2000);
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

const buildHighlightHTML = () => {

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

    let searchIcon = createSVGElement("#ffffff", "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z");
    searchButton.appendChild(searchIcon);
    let autoHighlightAddIcon = createSVGElement("#ffffff", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z; M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z");
    autoHighlightAddIcon.classList.add("hidden");
    searchButton.appendChild(autoHighlightAddIcon);


    let searchText = document.createElement("p");
    searchText.innerHTML = "Search";
    searchText.setAttribute("class", "buttonText");
    searchButton.appendChild(searchText);

    let autoHighlightAddText = document.createElement("p");
    autoHighlightAddText.innerHTML = "Add";
    autoHighlightAddText.setAttribute("class", "buttonText hidden");
    autoHighlightAddText.setAttribute("id", "autoHighlightAddText");
    searchButton.appendChild(autoHighlightAddText);

    gridWrapper.appendChild(searchButton);

    //auto highlight add button
    let autoHighlightAddButton = document.createElement("button");
    autoHighlightAddButton.setAttribute("id", "autoHighlightAddButton");
    autoHighlightAddButton.setAttribute("class", "button hidden");


    //reset button
    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.setAttribute("class", "button");

    let resetIcon = createSVGElement("#ffffff", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z; M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z");
    resetButton.appendChild(resetIcon)

    let resetText = document.createElement("p");
    resetText.innerHTML = "Reset";
    resetText.setAttribute("class", "buttonText");
    resetButton.appendChild(resetText);
    gridWrapper.appendChild(resetButton);


    //toggle button
    let toggleButton = document.createElement("button");
    toggleButton.setAttribute("id", "toggleButton");
    toggleButton.setAttribute("class", "button");
    toggleButton.innerHTML = "Show auto highlighted";
    gridWrapper.appendChild(toggleButton);


    //eventlisteners for buttons or keypresses
    inputField.addEventListener("keyup", event => {
        event.preventDefault();
        if (event.key === "Enter") {
            let keywordsInput = inputField.value.toLowerCase().split(",").filter(Boolean);

            if (autoHighlightListShown) {
                keywordsInput.forEach(keyword => autoHighlight(cleanString(keyword)));
            } else {
                keywordsInput.forEach(keyword => highlight(cleanString(keyword)));
            }

            inputField.value = ""
        }
    });

    searchButton.addEventListener("click", () => {
        let keywordsInput = inputField.value.toLowerCase().split(",").filter(Boolean);

        if (autoHighlightListShown) {
            keywordsInput.forEach(keyword => autoHighlight(cleanString(keyword)));
        } else {
            keywordsInput.forEach(keyword => highlight(cleanString(keyword)));
        }

        inputField.value = ""
    });

    resetButton.addEventListener("click", resetHighlight);
    toggleButton.addEventListener("click", () => toggleAutoHighlightList());

    //lists
    buildHighlightedKeywordList(wrapper);
    buildAutoHighlightList(wrapper);
}

const buildHighlightedKeywordList = (wrapper) => {
    let keywordListWrapper = document.createElement("div");
    keywordListWrapper.setAttribute("id", "HighlightedKeywordListWrapper");
    wrapper.appendChild(keywordListWrapper);

    let keywordList = document.createElement("ul");
    keywordList.setAttribute("id", "highlightedKeywordList");
    keywordListWrapper.appendChild(keywordList);

    keywordList.addEventListener("click", (event) => unhighlight(event.target));
}

const buildAutoHighlightList = (wrapper) => {
    let autoHighlightWrapper = document.createElement("div");
    autoHighlightWrapper.setAttribute("id", "autoHighlightWrapper");
    wrapper.appendChild(autoHighlightWrapper);

    let keywordList = document.createElement("ul");
    keywordList.setAttribute("id", "autoKeywordList");
    keywordList.setAttribute("class", "hidden");
    autoHighlightWrapper.appendChild(keywordList);

    keywordList.addEventListener("click", (event) => removeFromAutoHighlightList(event.target));

    getAutoHighlightedWords();
}

const getAutoHighlightedWords = async () => {
    autoKeywords = await getLocalStorage("autoHighlightList");
    if (autoKeywords == null) autoKeywords = [];
    let listElement = document.querySelector("#autoKeywordList");

    autoKeywords.forEach(keyword => {
        highlight(keyword);

        let keywordElement = document.createElement("li");
        keywordElement.innerHTML = capitalizeFirstLetterOfWords(keyword);
        keywordElement.setAttribute("class", "keyword")
        listElement.appendChild(keywordElement);
    })
}

const toggleAutoHighlightList = () => {
    autoHighlightListShown = !autoHighlightListShown;
    let toggleButton = document.querySelector("#toggleButton");
    let highlightButton = document.querySelector("#highlightButton");
    let highlightedKeywordList = document.querySelector("#highlightedKeywordList");
    let autoKeywordList = document.querySelector("#autoKeywordList");

    if (autoHighlightListShown) {
        toggleButton.innerHTML = "Show currently highlighted";
    } else {
        toggleButton.innerHTML = "Show auto highlighted";
    }

    highlightedKeywordList.classList.toggle("hidden");
    autoKeywordList.classList.toggle("hidden");

    Array.from(highlightButton.children).forEach(child => {
        child.classList.toggle("hidden");
    });
}

const highlight = (keyword) => {
    let videoArray = document.getElementsByTagName("ytd-grid-video-renderer");

    for (let i = 0; i < videoArray.length; i++) {
        let video = videoArray[i];
        let videoTitle = video.querySelector(`a[id^="video-title"]`).innerHTML;
        videoTitle = cleanString(videoTitle).toLowerCase();

        if (videoTitle.indexOf(keyword) != -1) {
            video.classList.add("highlighted");

            let list = highlightedVideos.get(video);
            if (list == null) {
                list = [keyword];
            } else if (list.includes(keyword)) { }
            else {
                list.push(keyword);
            }
            highlightedVideos.set(video, list);
        }
    }

    addKeywordToHTML(keyword);
    updateKeywordCount();
}

const autoHighlight = async (keyword) => {
    if (autoKeywords.includes(keyword)) return;

    let listElement = document.querySelector("#autoKeywordList");
    let keywordElement = document.createElement("li");
    keywordElement.innerHTML = capitalizeFirstLetterOfWords(keyword);
    keywordElement.setAttribute("class", "keyword")
    listElement.appendChild(keywordElement);

    highlight(keyword);
    autoKeywords.push(keyword);
    autoKeywords.sort();
    setLocalStorage("autoHighlightList", autoKeywords);
}

const removeFromAutoHighlightList = async (element) => {
    let keyword = element.innerHTML;
    autoKeywords = autoKeywords.filter(k => k !== keyword);

    //remove <li> from the HTML keyword wrapper
    element.remove();
    setLocalStorage("autoHighlightList", autoKeywords);
}

const addKeywordToHTML = (currentKeyword) => {
    let keywordListWrapper = document.getElementById("highlightedKeywordList");
    let keywordList = document.querySelector("#highlightedKeywordList").querySelectorAll(".keyword");
    let exists = false

    keywordList.forEach(keyword => {
        if (keyword.innerHTML === currentKeyword) exists = true;
    })

    if (exists) return

    let keywordElement = document.createElement("li");
    keywordElement.setAttribute("class", "keyword");
    keywordElement.setAttribute("data-count", "0");
    keywordElement.innerHTML = capitalizeFirstLetterOfWords(currentKeyword);
    keywordListWrapper.appendChild(keywordElement);
    keywords.push(currentKeyword);
}

const unhighlight = (element) => {
    let keyword = element.innerHTML;

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
            video.classList.remove("highlighted");
            highlightedVideos.delete(video);
        }
    })

    //remove <li> from the HTML keyword wrapper
    element.remove();
    keywords = keywords.filter(k => k !== keyword)
    updateKeywordCount();
}

const resetHighlight = () => {
    if (autoHighlightListShown) {
        chrome.storage.local.remove("autoHighlightList");
        autoKeywords.length = 0;
        document.querySelector("#autoKeywordList").innerHTML = "";
    } else {
        Array.from(highlightedVideos.keys()).forEach(video => video.classList.remove("highlighted"));
        highlightedVideos.clear();
        keywords.length = 0;
        document.querySelector("#highlightedKeywordList").innerHTML = "";
    }
}

const updateKeywordCount = () => {
    let count = getKeywordCount();
    let keywordList = document.querySelector("#highlightedKeywordList").querySelectorAll(".keyword");

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

const cleanString = (string) => {
    return string.replace(/\s+/g, ' ').trim();
}

const capitalizeFirstLetterOfWords = (string) => {
    let words = string.split(" ");

    words.forEach((word, index, array) => {
        array[index] = word.charAt(0).toUpperCase() + word.slice(1);
    });

    return words.join(" ");
}