console.log("Je vais repondre aux questions !");

//myRuntime.postMessage({connect: "(SCript de contenu) Je te reçoit runtime"});
let questions = document.querySelector("input[type='radio']");
for(var i =0; i < reponse.length; i++){
  if(questions[i].value === "NON" && questions[i].name !== "recherche"){
    questions[i].checked = true;
  }else questions[i].checked = questions[i].name === "recherche" && questions[i] === "OUI";
}

let myRuntime = chrome.runtime.connect({name: 'Questionnaire'});

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
for (var i=0; i<inputBox.length; i++){
  document.getElementById(inputBox[i]).click();
  console.log(inputBox[i] + inputBox.length);
}
*/