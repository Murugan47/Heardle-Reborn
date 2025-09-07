function myfunction() 
{
    var popup = document.getElementById("tutorialpopup");
    popup.classList.toggle("show");
}

function myfunctiontwo() 
{
    var popup = document.getElementById("aboutpopup");
    popup.classList.toggle("show");
}

import { API_KEY } from './config.js';

function loadClient() {
  gapi.client.setApiKey(API_Key); // public API key
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() { console.log("GAPI client loaded for API"); },
          function(err) { console.error("Error loading GAPI client for API", err); });
}

gapi.load("client", loadClient);