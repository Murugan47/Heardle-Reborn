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

async function youtubeRequest()
{
    var api_url = "https://youtube.googleapis.com/youtube/v3/videos?key=[AIzaSyDnepoj7VlCv5QY9oeM1vOY2vpCUIv5zqQ]"
    try
    {
        print("ten thousand")
        var fetchResponse = await fetch(api_url);
        const result = await response.json();
        console.log(result);
    }
    catch
    {
        print("my pc");
    }
}