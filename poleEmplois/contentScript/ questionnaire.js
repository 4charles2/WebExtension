console.log("Je vais repondre aux questions !");

var myRuntime = chrome.runtime.connect({name: 'Questionnaire'});
myRuntime.postMessage({connect: "(SCript de contenu) Je te reçoit runtime"});
// TODO: Finir ce script le 26 février
myRuntime.onMessage.addListener(function(msg){
  switch (document.location){
    case url_First_question:
      //repondre a la question et cliquer sur sublit
      //Mettre beaucoup de securite sur la verification des questions
      //et sur la verification des reponse text doit être strictement égal à text
      //Sinon arrete et prevenir chomeur
      break;
    case url_list_question:
      //repondre aux question et cliquer sur submit
      //Mettre beaucoup de securite sur la verification des questions
      //et sur la verification des reponse text doit être strictement égal à text
      //Sinon arrete et prevenir chomeurv
      break;
    case url_validation_questionnaire:
    //Mettre beaucoup de securite sur la verification des questions
    //et sur la verification des reponse text doit être strictement égal à text
    //Sinon arrete et prevenir chomeur
      //envoyer un message a runtime avec capture de la page
      //cliquer sur submit
      break;
  }
});
/********************* QUESTIONNAIRE ************************/

//Sur une page
//document.getElementById("formationNon").click();
//document.querySelector(".js-only[type='submit']").click();

//Sur une autre page
/*
var inputBox = [
  "blocTravail-close",
  "blocStage-close",
  "blocMaladie-close",
  "blocRetraite-close",
  "blocInvalidite-close",
  "blocRecherche-close"];
for (var i=0; i<inputBox.length; i++){
  document.getElementById(inputBox[i]).click();
  console.log(inputBox[i] + inputBox.length);
}
*/
//document.querySelector(".js-only[type='submit']").click();

//Sur une autre page
document.querySelector(".js-only[type='submit']").click();
