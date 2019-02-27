console.log("Je vais repondre aux questions !");


let myRuntime = chrome.runtime.connect({name: 'Questionnaire'});

myRuntime.postMessage({connect: "(SCript de contenu) Je te reçoit runtime"});

myRuntime.onMessage.addListener(function(m){
  switch(m){
    case m.hasOwnProperty("formation"):
      document.getElementById("formationNon").checked = true;

      document.querySelector("button[type='submit']").click();
      break;
    case m.hasOwnProperty("questionnaire"):
      let questions = document.querySelector("input[type='radio']");
      for(var i =0; i < reponse.length; i++){
        if(questions[i].value === "NON" && questions[i].name !== "recherche"){
          questions[i].checked = true;
        }else questions[i].checked = questions[i].name === "recherche" && questions[i] === "OUI";
      }
      //document.querySelector(".js-only[type='submit']").click();
      break;
    case m.hasOwnProperty("valider"):
      //Réaliser une capture d'ecran
      // valider et envoyer un message avec la capture d'ecran'
      break;
  }
});

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
