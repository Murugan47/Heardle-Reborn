var api_key = null;
var id_list = [];
var search_list = [];
var video_size = 500;
var currently_playing = false;
var current_row = 1;
var max_guesses = 6;

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

// Starts a round of the game
function roundStart() {
    var random_song_multiplier = id_list.length;
    var random_song = id_list[Math.floor(Math.random() * random_song_multiplier)];

    var body = document.getElementById("webpagebody");

    //YouTube player is embedded
    body.innerHTML += `<div class=\"playerdiv\"><iframe id="player" style="display:none" width=` + video_size + ` height=` + video_size + ` src=\"https://www.youtube.com/embed/` + random_song + `?enablejsapi=1"></iframe></div>`;

    //Search bar, skip button, guess button and horizontal bar is added
    body.innerHTML += "<div class=\"searchdiv\"><hr class=\"horizontalline\"><form><input class=\"searchbar\" type=\"text\"><input class=\"button guessbutton\" type=\"button\" value=\"Guess\" onclick=\"guessing()\"><input class=\"button skipbutton\" type=\"button\" value=\"Skip\" onclick=\"skipping()\"></form></div>";

    //Play button is added
    body.innerHTML += "<div class=\"playbuttondiv\"><button class=\"playbutton\" onclick=\"playback()\"></button></div>";

    //Attempts table is added
    body.innerHTML += "<div class=\"tablediv\"><table class=\"attemptstable\"><tr><td class=\"row\" id=\"row1\"></td></tr><tr><td class=\"row\" id=\"row2\"></td></tr><tr><td class=\"row\" id=\"row3\"></td></tr><tr><td class=\"row\" id=\"row4\"></td></tr><tr><td class=\"row\" id=\"row5\"></td></tr><tr><td class=\"row\" id=\"row6\"></td></tr></table></div>"

    //Progress bar is added
    body.innerHTML += "<div class=\"progressbardiv\"><table class=\"bartable\"><th><td class=\"bar\" id=\"bar1\"></th><th><td class=\"bar\" id=\"bar2\"></th><th><td class=\"bar\" id=\"bar3\"></th><th><td class=\"bar\" id=\"bar4\"></th><th><td class=\"bar\" id=\"bar5\"></th><th><td class=\"bar\" id=\"bar6\"></th></table></div>"
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

// Gets playlist results using the YouTube API (temporary as a maximum of 50 playlist items can be returned)
function youtubeRequest() {
    return gapi.client.youtube.playlistItems.list({
      "part": [
        "snippet"
      ],
      "maxResults": 50,
      "playlistId": "PLZxfqz84iPB64kfJE36mGBcrCF4nQRkX7"
    })
        .then(function(response) {
                // Handling results by parsing all the video IDs returned
                var loop_counter = 0;
                var id_index = 0;
                var search_index = 0;
                var substring_beginning_offset = 1
                var substring_end_offset = 2
                var length = response.body.length
                var record_flag = false;
                var search_flag = false;
                var current_string = "";
                var current_char = "";

                while(loop_counter < length)
                {
                    current_char = response.body.charAt(loop_counter)
                    if((current_char == " " && search_flag == false) || (current_char == "\"" && search_flag == true)) //Reset the current string
                    {
                        if(record_flag == true) //Put the video ID in the IDs array
                        {
                            id_list[id_index] = current_string.substring(substring_beginning_offset, current_string.length - substring_end_offset);
                            id_index++;
                        }
                        else if(search_flag == true) //Put the video name in the names array
                        {
                            search_list[search_index] = current_string.substring(substring_beginning_offset, current_string.length - substring_end_offset);
                            search_index++;
                        }

                        if(current_string == "\"videoId\":") //If the next word is the video ID
                        {
                            record_flag = true;
                        }
                        else
                        {
                            record_flag = false;
                        }

                        if(current_string == "\"title\":") //If the next word is the video name
                        {
                            search_flag = true;
                            loop_counter++;
                        }
                        else
                        {
                            search_flag = false;
                        }

                        current_string = "";
                    }
                    else //Add to the current string
                    {
                        current_string += current_char;
                    }

                    loop_counter++;
                }
                
                roundStart();
              },
              function(err) { console.error("Execute error", err); });
}

// Gets API Key provided by user
function apiKeyReceived() {
    api_key = document.getElementById("apiask").value;
    document.getElementById("apidiv").remove();

    loadClient();
    youtubeRequest();
}

// Controls playback of music
function playback() {
    var player = document.getElementById("player");
    console.log(player);

    if(currently_playing == false)
    {
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        currently_playing = true;
    }
    else
    {   
        player.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        currently_playing = false;
    }
}

// Guess button functionality
function guessing() {
    if(current_row < max_guesses)
    {
        row = document.getElementById("row" + current_row);
        row.innerHTML = "&#10060  guess " + current_row;
        current_row++;
    }
    else
    {
        console.log("fail unless you won");
    }
}

//Skip button functionality
function skipping() {
    if(current_row < max_guesses)
    {
        row = document.getElementById("row" + current_row);
        row.innerHTML = "Skipped";
        current_row++;
    }
    else
    {
        console.log("fail unless you won");
    }
}