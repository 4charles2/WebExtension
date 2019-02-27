
console.log("Je suis dans popup.js");
let menuElmnt = document.getElementById("menu");

let myRuntime = chrome.runtime.connect({name: "popup"});
myRuntime.postMessage({'verif': "as tu les infos"});


myRuntime.onMessage.addListener(function(msg){
    switch(true){
        case msg.hasOwnProperty('identification'):
            console.log(msg);
            if (msg.identification != "false"){
                console.log("identifiant user OK");
                menuElmnt.style.display = "block";
                document.getElementById("msg").remove();
            }
            else {
                menuElmnt.style.display = "none";
            }
            break;
        case msg.hasOwnProperty('news'):
            if (msg.news !== "false"){
                console.log(msg.news);
                let data = JSON.parse(msg.news);
                for (let info in data)
                    document.getElementById(info).textContent = data[info];
            }
            break;
        default:
            console.log("Message sans propriéte définie !");
            console.log(msg);
            break;
    }
});

var aLink = document.getElementById("options_page");
aLink.addEventListener("click", function() {
  chrome.runtime.openOptionsPage();
});