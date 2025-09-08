var api_key = null;

// The Tutorial pop-up
function tutorialPopUp() {
    var popup = document.getElementById("tutorialpopup");
    popup.classList.toggle("show");
}

// The About pop-up
function aboutPopUp() {
    var popup = document.getElementById("aboutpopup");
    popup.classList.toggle("show");
}

// Loads the YouTube API
function loadClient() {
    gapi.client.setApiKey(api_key);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(
            function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); }
        );
}

// Load GAPI automatically when the script runs
gapi.load("client", loadClient);

// Performs a search with the YouTube API
function youtubeRequest(query = "Top hits 2025") {
    gapi.client.youtube.search.list({
        part: "snippet",
        q: query,
        maxResults: 5,
        type: "video"
    }).then(response => {
        console.log("Search results:", response.result.items);
    }).catch(err => console.error("YouTube API request failed", err));
}

// Gets API Key provided by user
function apiKeyReceived() {
    api_key = document.getElementById("apiask").value;
    document.getElementById("apidiv").remove();

    loadClient();
    youtubeRequest();
}