import {Storage} from "/storage/storage.js"

//Selectionne les forms du document
var forms = document.forms;
var myRuntime = browser.runtime.connect({name: "options"});
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
        console.log("sauvegarde de " + user);
      }
      Storage.setData(form.name, user);
      if(form.name === 'identification'){

        myRuntime.postMessage({identification: "J'ai bien enregistrer les identifiants de l'User !"});
      }
}
