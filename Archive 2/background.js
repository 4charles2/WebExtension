import {Chomeur} from "/modules/Chomeur.js";
import {Storage} from "/storage/Storage.js";
import {injectFileActiveTab} from "/libWebExtension/injectFileActiveTab.js"

let URLs = {
  "urlConnect": "https://authentification-candidat.pole-emploi.fr/connexion/XUI/#login/&realm=%2Findividu&goto=https%3A%2F%2Fauthentification-candidat.pole-emploi.fr%2Fconnexion%2Foauth2%2Fauthorize%3Frealm%3D%252Findividu%26response_type%3Did_token%2520token%26scope%3Dopenid%2520idRci%2520profile%2520contexteAuthentification%2520email%2520courrier%2520notifications%2520etatcivil%2520logW%2520individu%2520pilote%2520nomenclature%2520coordonnees%2520navigation%2520reclamation%2520prdvl%2520idIdentiteExterne%26client_id%3DUSG_PN073-tdbcandidat_6408B42F17FC872440D4FF01BA6BAB16999CD903772C528808D1E6FA2B585CF2%26state%3DeD6N8ikP6PGPciAz%26nonce%3DqHx1uLZ9J6J-bIhb%26redirect_uri%3Dhttps%253A%252F%252Fcandidat.pole-emploi.fr%252Fespacepersonnel%252F",
  "homepage": {
    "urlButtonActualisation": "a[href='https://authentification-candidat.pole-emploi.fr/compte/redirigervers?url=https://actualisation-authent.pole-emploi.fr/acces.htm&actu=true']",
    "urlEspacePerso":         "https://candidat.pole-emploi.fr/espacepersonnel/"
  }
}

let pathScripts = {
  "connect":        "/contentScript/connexion.js",
  "PoleEmplois":    "/modules/PoleEmplois.js",
  "homepage":       "/contentScript/homepage.js",
  "questionnaire":  "/contentScript/questionnaire.js"
};

//Si date du jour et date de prochaine actualisation est égale alors éxecute l'extension
let charles;
console.log(charles);

main();

function main(){
  Storage.hydrate();
  charles = new Chomeur(Storage.identification.identifiant, Storage.identification.password, Storage.identification.codePostal);
  let DateDuJour = new Date();
  let dateNextActualisation = Storage.news.dateNextActualisation ? Storage.news.dateNextActualisation.split(' ') : undefined;
  let intervalId = false;
  //Et lance l'actualisation du chomeur et des données si besoin
  console.log(Storage.news.dateNextActualisation);
  console.log(Storage.identification);

  console.log(charles);
  //If une execution avait déjà été lancer la stop;
  intervalId ? clearInterval(intervalId):'';

  if(Storage.identification){
    //Vérifie quotidiennement les informations stocké
    intervalId = setInterval(function(){
      if(dateNextActualisation === undefined || DateDuJour.getUTCDate() >= dateNextActualisation[1]){
        console.log("je creer l'onglet Pole emplois");
        //console.log(DateDuJour.getUTCDate() + " <= " + dateNextActualisation[1]);
        var tab = browser.tabs.create({
          "url": URLs.urlConnect,
          "active": true
        }).then((greeting) => {
          browser.tabs.executeScript({
            file: pathScripts.connect
          });
          console.log(greeting);
        }, (error) => {
          console.log("Une erreur pendant la création du nouvelle onglet" + error);
        });
      }else{
        console.log('Vous etes déjà actualiser !');
      }
    }, 60000);//86400000
  }else{
    console.log("les identifiants ne sont pas entrer !");
    browser.tabs.create({"url": "/options/options.html", "active": true})
    .then( () => { browser.tabs.executeScript({ code: `console.log("Vous n'avez pas encore entrer vos identifiants !");`}) },
         () => { browser.tabs.executeScript({ code: `console.log("Une erreur est survenue veuillez desinstaller l'extension et la réinstaller ! \n si le probleme persiste contacter le developpeur : contact@charles-tognol.fr ");`}) } );
  }
}
//Liste des ports de connexion avec les scripts de contenu
var connectFromCS = [];
//Reçoit la connection des script de contenu
browser.runtime.onConnect.addListener((remote) => {
  connectFromCS[remote.sender.tab.id] = remote;
  connectFromCS[remote.sender.tab.id].postMessage({
      greeting: "(background) Salut script de contenu Nous sommes connecté !"
  }),
  connectFromCS[remote.sender.tab.id].onMessage.addListener(function(msg) {
    if(!msg.hasOwnProperty('error') && !msg.hasOwnProperty('finish')){
      switch(remote.name){
        case("Identification"):
          eventIdentification(remote, msg);
          break;
        case("EspacePersonnel"):
        console.log("coucou homepage.js");
          eventEspacePersonnel(remote, msg);
          break;
        case("Questionnaire"):
          eventQuestionnaire(remote, msg);
          break;
        case("options"):
            console.log("Merci ! La vérification est en cours ...");
            main();
          break;
        default:
          console.log("Aucune action pour le remote");
          console.log(remote);
          console.log("Le message reçu : ");
          console.log(msg);
          break
        }
      }else if (msg.hasOwnProperty('finish')) {
        browser.tabs.executeScript({code: `document.querySelector('.deconnexion').click()`});
        browser.tabs.executeScript({code: `document.querySelector('.btn-primary').click()`})
        //<button class="btn btn-primary" data-dismiss="modal" type="button">Quitter mon espace</button>
      }else{
        console.log("Une erreur à été levée");
        console.log(msg);
      }
  });
});

function eventQuestionnaire() {
  // TODO: Faire le questionnaire à la prochaine actualisation
    // envoyer un mail à adresse email stocké avec la capture de
    // l'écran reçu en message du script questionnaire.js
}

/**
 * Core pour le script homepage.js (Script injecter dans la page Espace personnel)
 * @return {[type]} [description]
 */
function eventEspacePersonnel(remote, msg){
  switch (true) {
    case msg.hasOwnProperty('connect'):
        remote.postMessage({URLs: JSON.stringify(URLs.homepage)});
        remote.postMessage({collecInfo: "Collect les infos"});
      break;
      case msg.hasOwnProperty('news'):
      console.log("J'ai bien reçu les infos");
      console.log(msg.news);
        Storage.setData('news', JSON.parse(msg.news));
        remote.postMessage({actualisation: "Lance l'actualisation"});
        break;
      case msg.hasOwnProperty('actualisation'):
      //// TODO: définir les urls Page de l'actualisation
        injectFileActiveTab(urlPage,pathScripts,10);
        break;
    default:
      console.log(msg);
      break;
  }
}
/**
 * Core pour le script connexion.js (Script injecter dans la page d'identification de PoleEmplois)
 * Une connexion en continue à été établie avant
 * @param  {[type]} remote "information de la connection entre le script et runtime"
 * @param  {[type]} msg    "Msg reçu du script"
 */
function eventIdentification(remote, msg){
  switch (true) {
    case msg.hasOwnProperty('connect'):
      console.log("Send data Chomeur");
      remote.postMessage({chomeur: JSON.stringify(charles)});
      break;
    case msg.hasOwnProperty('homepage'):
      console.log(msg.homepage);
      injectFileActiveTab(URLs.homepage.urlEspacePerso, pathScripts.homepage, 10);
      break;
    default:
      console.log("Message du remote : ");
      console.log(remote);
      console.log("Aucune propriete definie : ");
      console.log(msg);
      break;
  }
}
