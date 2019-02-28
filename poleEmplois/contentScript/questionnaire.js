//questionnaire
console.log("Je vais repondre aux questions !");

myRuntime = chrome.runtime.connect({name: 'Questionnaire'});

myRuntime.postMessage({connect: "(SCript de contenu) Je te reçoit runtime"});
console.log(msg);
let questions = document.querySelector("input[type='radio']");
for (var i = 0; i < reponse.length; i++) {
    if (questions[i].value === "NON" && questions[i].name !== "recherche")
        questions[i].checked = true;
    else questions[i].checked = questions[i].name === "recherche" && questions[i] === "OUI";
}
myRuntime.postMessage({valide: "J'ai remplie et valider le questionnaire."});
//document.querySelector(".js-only[type='submit']").click();



/********************* QUESTIONNAIRE ************************/
//Sur une autre page
/*
var inputBox = [
  "blocTravail-close",
  "blocStage-close",
  "blocMaladie-close",
  "blocRetraite-close",
  "blocInvalidite-close",
  "blocRecherche-open"];
*/