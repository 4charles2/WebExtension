//transfere dans le fichier questionnaire
console.log("Je check la question sur les formations");

let myRuntime = chrome.runtime.connect({name: "Formation"});

document.getElementById("formationNon").checked = true;

document.querySelector("button[type='submit']").click();
myRuntime.postMessage({"questionnaire": "Je lance la page du questionnaire"});

