// Toggle tutorial popup
function myfunction() {
    var popup = document.getElementById("tutorialpopup");
    popup.classList.toggle("show");
}

// Toggle about popup
function myfunctiontwo() {
    var popup = document.getElementById("aboutpopup");
    popup.classList.toggle("show");
}

// Load the YouTube API client
function loadClient() {
    gapi.client.setApiKey(window.YOUTUBE_API_KEY); // use the key from config.js
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(
            function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); }
        );
}

// Load gapi client automatically when the script runs
gapi.load("client", loadClient);