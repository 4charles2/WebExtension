//Tableau de correspondance du pave numerique pour le password
var keyboardPassword = ["E", "A", "D", "B", "H", "I", "J", "F", "G", "C"];

console.log("Sur la page d'identification de pole emplois");

//Etablie la connexion avec le background
var myRuntime = chrome.runtime.connect({name: "Identification"});


//reçoit les message du background
myRuntime.onMessage.addListener(function(m){
  if(m.hasOwnProperty('chomeur')){
    console.log(JSON.parse(m.chomeur));
    connection(JSON.parse(m.chomeur));
  }else if (m.hasOwnProperty('greeting')){
    myRuntime.postMessage({thank: "Merci pour ta confirmation de connexion !"});
    console.log(m);
  }else {
    console.log("J'ai reçu un autre msg");
    console.log(m);
  }
});
//Indique que la connexion et OK
myRuntime.postMessage({connect: "(Script de contenu) Je te reçoit runtime."});

//Utilise une promise enchaînner
//If identifiant réussi alors saisie du mot de passe
//If l'enssemble réussi alors sendMessage au runtime key: homepage
//Else catch Une erreur alors sendMessage au runtime key: error

function connection(chomeur){
    return new Promise(function(resolve, reject){
      setTimeout(() => {
        if(chomeur.login != undefined){
          document.getElementById("identifiant").value = chomeur.login;
          document.getElementById("submit").click();
          console.log("Saisie des identifiant OK");
          resolve("identifiant OK");
        }else{
          console.log("login not defined");
          reject("login not defined");
        }
      }, 3000, resolve, reject);
    }).then(() => {

      setTimeout(() => {
        console.log("Saisie du mot de passe");
        if(chomeur.password != undefined){
          for(var i=0; i < chomeur.password.length; i++){
            console.log(parseInt(chomeur.password[i]));
            document.querySelector(".touche"+keyboardPassword[parseInt(chomeur.password[i], 10)]).click();
          }
          document.getElementById("codepostal").value = chomeur.codePostal;
          document.getElementById("submit").click();
          //resolve("password OK");
        }else {
          console.log("PassWord not defined");
          //reject("Password not defined");
        }
      }, 2000);
    }).then(resolve => {
      myRuntime.postMessage({homepage: "Saisie des identifiants Ok : " + resolve});
    }, reject => {
      myRuntime.postMessage({error: "Erreur lors de la saisie des identifiants : " + reject});
    });
}
