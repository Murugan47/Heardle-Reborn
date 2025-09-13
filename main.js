var id_list = [];
var search_list = [];
var video_size = 500;
var max_guesses = 6;
var mid_playing_length = 5;
var small_play_increase = 2;
var large_play_increase = 4;
var time_decrease = 0.1;
var time_multiplier = 1000;
var time_end = 0;
var max_results = 50;
var wait_time = 1000; //Temporary
var api_key = null;
var random_song_index = null;
var random_song = null;

//Variables reset every new round
var current_row = 1;
var currently_playing = false;
var playing_length = 16;
var time_left = 16;

//Original values of reset variables
var original_row = current_row;
var original_playing = currently_playing;
var original_length = playing_length;
var original_time_left = time_left;

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
    random_song_index = Math.floor(Math.random() * random_song_multiplier);
    random_song = id_list[random_song_index];

    var body = document.getElementById("webpagebody");

    //YouTube player is embedded
    body.innerHTML += `<div id=\"playerdiv\"><iframe id="player" style="display:none" width=` + video_size + ` height=` + video_size + ` src=\"https://www.youtube.com/embed/` + random_song + `?end=` + playing_length + `&enablejsapi=1"></iframe></div>`;

    //Search bar, skip button, guess button and horizontal bar is added
    body.innerHTML += "<div id=\"searchdiv\"><hr class=\"horizontalline\"><form onsubmit=\"return false\"><input id=\"searchbar\" type=\"text\"><input class=\"button guessbutton\" type=\"button\" value=\"Guess\" onclick=\"guessing()\"><input class=\"button skipbutton\" type=\"button\" value=\"Skip\" onclick=\"skipping()\"></form></div>";

    //Play button is added
    body.innerHTML += "<div id=\"playbuttondiv\"><button class=\"playbutton\" onclick=\"playback()\"></button></div>";

    //Attempts table is added
    body.innerHTML += "<div id=\"tablediv\"><table class=\"attemptstable\"><tr><td class=\"row\" id=\"row1\"></td></tr><tr><td class=\"row\" id=\"row2\"></td></tr><tr><td class=\"row\" id=\"row3\"></td></tr><tr><td class=\"row\" id=\"row4\"></td></tr><tr><td class=\"row\" id=\"row5\"></td></tr><tr><td class=\"row\" id=\"row6\"></td></tr></table></div>"

    //Progress bar is added
    body.innerHTML += "<div id=\"progressbardiv\"><table class=\"bartable\"><th><td class=\"bar\" id=\"bar1\"></th><th><td class=\"bar\" id=\"bar2\"></th><th><td class=\"bar\" id=\"bar3\"></th><th><td class=\"bar\" id=\"bar4\"></th><th><td class=\"bar\" id=\"bar5\"></th><th><td class=\"bar\" id=\"bar6\"></th></table></div>"
}

function roundEnd() {
    //Remove previous round
    document.getElementById("playerdiv").remove();
    document.getElementById("searchdiv").remove();
    document.getElementById("playbuttondiv").remove();
    document.getElementById("tablediv").remove();
    document.getElementById("progressbardiv").remove();

    //Reset variables
    current_row = original_length;
    currently_playing = original_playing;
    playing_length = original_playing;
    time_left = original_time_left;

    //Should show the end screen, but temporarily restarts for now
    roundStart();
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
      "maxResults": max_results,
      "playlistId": "PLZxfqz84iPB64kfJE36mGBcrCF4nQRkX7"
    })
        .then(function(response) {
                // Handling results by parsing all the video IDs returned
                var loop_counter = 0;
                var id_index = 0;
                var search_index = 0;
                var id_beginning_offset = 1
                var id_end_offset = 2
                var length = response.body.length
                var record_flag = false;
                var search_flag = false;
                var current_string = "";
                var current_char = "";
                var name_beginning_offset = 0;
                var name_end_offset = 0;

                while(loop_counter < length)
                {
                    current_char = response.body.charAt(loop_counter)
                    if((current_char == " " && search_flag == false) || (current_char == "\"" && search_flag == true)) //Reset the current string
                    {
                        if(record_flag == true) //Put the video ID in the IDs array
                        {
                            id_list[id_index] = current_string.substring(id_beginning_offset, current_string.length - id_end_offset);
                            id_index++;
                        }
                        else if(search_flag == true) //Put the video name in the names array
                        {
                            search_list[search_index] = current_string.substring(name_beginning_offset, current_string.length - name_end_offset);
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

// Waiting out some time, this function is currently broken because setTimeout only runs once
function delay() {
    setTimeout(function() {
        ;
    }, time_decrease * time_multiplier);
}

// 16 second timer for music
function playbackCap() {
    while(currently_playing == true && time_left > time_end)
    {
        delay();
        time_left -= time_decrease;
    }

    if(time_left <= time_end)
    {
        time_left = original_row;
    }
    currently_playing = original_playing;
}

// Controls playback of music
function playback() {
    var player = document.getElementById("player");

    if(currently_playing == false)
    {
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        currently_playing = true;
        playbackCap();
    }
    else
    {   
        player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        currently_playing = false;
    }
}

// Guess button functionality
function guessing() {
    if(current_row < max_guesses)
    {
        var user_entered_guess = document.getElementById("searchbar").value;

        //If you won
        if(search_list[random_song_index].toLowerCase() == user_entered_guess.toLowerCase())
        {
            row = document.getElementById("row" + current_row);
            row.innerHTML = "&#10003 " + user_entered_guess;

            //Ends game
            setTimeout(roundEnd, wait_time);
        }
        else if(user_entered_guess != "") //Incorrect guess
        {
            row = document.getElementById("row" + current_row);
            row.innerHTML = "&#10060 " + user_entered_guess;
            current_row++;

            //Resets search bar
            document.getElementById("searchbar").value = "";

            //Adds to video playtime
            /*if(current_row < mid_playing_length)
            {
                playing_length += small_play_increase;
            }
            else
            {
                playing_length += large_play_increase;
            }
            currently_playing = false;*/

            //Adds progress to the progress bar
            //document.getElementById("bar" + current_row).style["background-color"] = "rgb(112, 138, 143)";
        }
    }
    else
    {
        //Ends game
        roundEnd();
    }
}

//Skip button functionality
function skipping() {
    if(current_row < max_guesses)
    {
        row = document.getElementById("row" + current_row);
        row.innerHTML = "Skipped";
        current_row++;

        //Adds to video playtime
        /*if(current_row < mid_playing_length)
        {
            playing_length += small_play_increase;
        }
        else
        {
            playing_length += large_play_increase;
        }
        currently_playing = false;*/

        //Adds progress to the progress bar
        //document.getElementById("bar" + current_row).style["background-color"] = "rgb(112, 138, 143)";
    }
    else
    {
        //Ends game
        roundEnd();
    }
}