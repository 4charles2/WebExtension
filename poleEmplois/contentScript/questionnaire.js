//questionnaire
console.log("Je vais repondre aux questions !");

let myRuntime = chrome.runtime.connect({name: 'Questionnaire'});

myRuntime.postMessage({connect: "(SCript de contenu) Je te reçoit runtime"});

let questions = document.querySelectorAll("input[type='radio']");
if(questions){
    for (let question of questions) {
        if (question.value === "NON" && question.name !== "recherche")
            question.checked = true;
        else question.checked = (question.name === "recherche" && question.value === "OUI");
    }
    myRuntime.postMessage({valide: "J'ai remplie et valider le questionnaire."});
    document.querySelector(".js-only[type='submit']").click();
}else{
    myRuntime({finish: "Déjà actualisé ou un autre problème est survenue"});
}




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