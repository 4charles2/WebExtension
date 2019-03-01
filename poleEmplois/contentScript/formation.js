//transfere dans le fichier questionnaire
console.log("Je check la question sur les formations");

let myRuntime = chrome.runtime.connect({name: "Formation"});
let elmt = document.getElementById("formationNon");
if(elmt){
    elmt.checked = true;

    myRuntime.postMessage({"questionnaire": "Je lance la page du questionnaire"});
    document.querySelector("button[type='submit']").click();
}else{
    myRuntime.postMessage({finish: "Actualisation déjà réalisé"});
}


