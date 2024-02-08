const lastUpdateElement = document.getElementById("last-update");
const updateTitleElement = document.getElementById("update-title");
const updateContentElement = document.getElementById("update-content");

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
        const lastUpdate = data.appnews.newsitems[0];

        console.log(`%c${lastUpdate.title}`, "color: #f00; font-size: 20px; font-weight: bold;");
        console.log(lastUpdate);

        lastUpdateElement.innerHTML = convertUnixTimestampToRelativeTime(lastUpdate.date);
        updateTitleElement.innerHTML = `<a href="${lastUpdate.url}" target="_blank">${lastUpdate.title}</a>`;

        const updateContent = lastUpdate.contents;
        const convertedContent = XBBCODE.process({
            text: updateContent,
            removeMisalignedTags: true,
            addInLineBreaks: true
        });

        const convertedContentHtml = convertedContent.html.replace(/&quot&#59;/g, '"').replace(/&#39&#59;/g, "'");

        updateContentElement.innerHTML = convertedContentHtml;
    } catch (error) {
        console.error(`Error fetching update data: ${error}`);
    }
}

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
