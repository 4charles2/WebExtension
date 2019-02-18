//import {Storage} from "/storage/storage.js"

console.log("Je suis dans options page !");

//Selectionne les forms du document
var forms = document.forms;
var myRuntime = chrome.runtime.connect({name: "options"});
//myRuntime.postMessage({})
//ajoute un event submit au form pour declanche la sauvegarde des paramètres
//Appel la fonction saveOptions
for(var form of forms){
    form.addEventListener('submit', function (){
        saveOptions(this);
    });
}

function saveOptions(form){
  let user = {};
    for(let i=0; i<form.length; i++)
      if( form[i].type !== "submit" && form[i].value !== "" ){
         user[form[i].name] = form[i].value;
        console.log("sauvegarde de : ");
        console.log(user);
      }
      //Storage.setData(form.name, user);
    if(form.name === 'identification'){
        console.log("J'envoie le message des identifiants de l'user");
        console.log(user);
        myRuntime.postMessage({"identification": JSON.stringify(user)});
    }else{
          console.log('Modification des URL mais pas encore prise en charge ! ' + form.name);
    }
}