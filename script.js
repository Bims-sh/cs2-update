const fetchBoxElement = document.getElementById("fetch-box");
const updateTitleElement = document.getElementById("update-title");
const updateTitleTextElement = document.getElementById("update-title-text");
const updateContentElement = document.getElementById("update-content");
const updateInfoElement = document.getElementById("update-info");
const updateDateRelative = document.getElementById("update-date-relative");
const navButtons = document.getElementById("nav-buttons");
const prevButton = document.getElementById("prev-update");
const nextButton = document.getElementById("next-update");

let updates = [];
let currentIndex = 0;

async function getLastCounterStrikeUpdate() {
    await new Promise(r => setTimeout(r, 1000));
    const url = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=730";
    const corsProxy = "https://api.codetabs.com/v1/proxy?quest=";

    try {
        const response = await fetch(`${corsProxy}${url}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        updates = data.appnews.newsitems.filter(update => update.feedname === "steam_community_announcements");

        if (updates.length > 0) {
            displayUpdate(currentIndex);
        }
    } catch (error) {
        console.error(`Error fetching update data: ${error}`);
    }
}

function displayUpdate(index) {
    const update = updates[index];

    fetchBoxElement.classList.add("hidden");
    updateInfoElement.classList.remove("hidden");
    navButtons.classList.remove("hidden");;
    updateTitleTextElement.innerHTML = `<a href="${update.url}" target="_blank">${update.title}</a>`;
    updateDateRelative.innerHTML = "(" + convertUnixTimestampToRelativeTime(update.date) + ")";

    const updateContent = update.contents;
    const convertedContent = XBBCODE.process({
        text: updateContent,
        removeMisalignedTags: true,
        addInLineBreaks: true
    });

    updateContentElement.innerHTML = convertedContent.html.replace(/&quot&#59;/g, '"').replace(/&#39&#59;/g, "'");

    prevButton.disabled = index === 0;
    nextButton.disabled = index === updates.length - 1;
}

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayUpdate(currentIndex);
    }
});

nextButton.addEventListener('click', () => {
    if (currentIndex < updates.length - 1) {
        currentIndex++;
        displayUpdate(currentIndex);
    }
});

function convertUnixTimestampToRelativeTime(timestamp) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const relativeTime = currentTimestamp - timestamp;

    return convertToRelativeTime(relativeTime);
}

function convertToRelativeTime(seconds) {
    const timeUnits = [60, 60, 24, 30, 12];
    const timeUnitsNames = ["second", "minute", "hour", "day", "month", "year"];

    for (let i = 0; i < timeUnits.length; i++) {
        if (seconds < timeUnits[i]) {
            return `${seconds} ${timeUnitsNames[i]}${seconds > 1 ? "s" : ""} ago`;
        }
        seconds = Math.floor(seconds / timeUnits[i]);
    }

    return `${seconds} ${timeUnitsNames[timeUnits.length]}${seconds > 1 ? "s" : ""} ago`;
}

getLastCounterStrikeUpdate();
