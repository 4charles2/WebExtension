import {Chomeur} from "/modules/Chomeur.js";
import {Storage} from "/storage/Storage.js";
import {injectFileActiveTab} from "/libWebExtension/injectFileActiveTab.js";


let dateFrenchs = ['Janv.', 'Févr.', 'Mars', "Avri.", "Mai", "Juin", "Juil.", "Aout", "Sept.", "Octo.", "Nove.", "Dece."];
let URLs = {
    "urlConnect": "https://authentification-candidat.pole-emploi.fr/connexion/XUI/#login/&realm=%2Findividu&goto=https%3A%2F%2Fauthentification-candidat.pole-emploi.fr%2Fconnexion%2Foauth2%2Fauthorize%3Frealm%3D%252Findividu%26response_type%3Did_token%2520token%26scope%3Dopenid%2520idRci%2520profile%2520contexteAuthentification%2520email%2520courrier%2520notifications%2520etatcivil%2520logW%2520individu%2520pilote%2520nomenclature%2520coordonnees%2520navigation%2520reclamation%2520prdvl%2520idIdentiteExterne%26client_id%3DUSG_PN073-tdbcandidat_6408B42F17FC872440D4FF01BA6BAB16999CD903772C528808D1E6FA2B585CF2%26state%3DeD6N8ikP6PGPciAz%26nonce%3DqHx1uLZ9J6J-bIhb%26redirect_uri%3Dhttps%253A%252F%252Fcandidat.pole-emploi.fr%252Fespacepersonnel%252F",
    "homepage": {
        "urlButtonActualisation": "a[href='https://authentification-candidat.pole-emploi.fr/compte/redirigervers?url=https://actualisation-authent.pole-emploi.fr/acces.htm&actu=true']",
        "urlEspacePerso": "https://candidat.pole-emploi.fr/espacepersonnel/"
    }
};

let pathScripts = {
    "connect": "/contentScript/connexion.js",
    "PoleEmplois": "/modules/PoleEmplois.js",
    "homepage": "/contentScript/homepage.js",
    "questionnaire": "/contentScript/questionnaire.js",
    "options": "/options/options.html"
};


let charles;
let intervalId = false;
let dateLastActualisation = new Date();

main();

function main() {
    //Met à jour l'obet storage avec les données localStorage;
    Storage.hydrate();
    charles = new Chomeur(Storage.identification.identifiant, Storage.identification.password, Storage.identification.codePostal);

    console.log(Storage.identification);

    console.log(charles);
    //If une execution avait déjà été lancer la stop;
    intervalId ? clearInterval(intervalId) : '';
    //Et lance l'actualisation du chomeur et des données si besoin
    if (Storage.identification) {
        //Vérifie quotidiennement les informations stocké
        intervalId = setInterval(function () {
            launch();
        }, 86400000);//86400000 Toutes les 24 Heures
    } else {
        console.log("les identifiants ne sont pas entrer !");
        console.log(chrome.runtime.getURL(pathScripts.options));
        chrome.runtime.openOptionsPage();
            //.then( () => { console.log("Vous n'avez pas encore entrer vos identifiants !"); },
              //     () => { console.log("Une erreur est survenue veuillez desinstaller l'extension et la réinstaller ! \n si le probleme persiste contacter le developpeur : contact@charles-tognol.fr ");}
                // );
    }
}

function launch(){
    Storage.hydrate();
    let DateDuJour = new Date();
    let dateNextActualisation = Storage.news.dateNextActualisation ? Storage.news.dateNextActualisation.split(' ') : undefined;
    console.log(Storage.news.dateNextActualisation);
    if (dateNextActualisation === undefined || DateDuJour.getUTCDate() >= dateNextActualisation[1]) {
        //J' enregistre la date de verification d'actualisation pour comparaison ultérieure
        console.log("je creer l'onglet Pole emplois");
        //console.log(DateDuJour.getUTCDate() + " <= " + dateNextActualisation[1]);
        var tab = chrome.tabs.create({
            "url": URLs.urlConnect,
            "active": true
        }, function(tab){
            chrome.tabs.executeScript({file: pathScripts.connect});
        });
        //Chrome ne prend pas en charge les promises
        /*.then((greeting) => {
        chrome.tabs.executeScript({
            file: pathScripts.connect
        });
        console.log(greeting);
    }, (error) => {
        console.log("Une erreur pendant la création du nouvelle onglet" + error);
    });
    */
    } else {
        console.log("Vous etes déjà actualiser !");
    }
}

//Liste des ports de connexion avec les scripts de contenu
var connectFromCS = [];
//Reçoit la connection des script de contenu
chrome.runtime.onConnect.addListener((remote) => {
    connectFromCS[remote.sender.contextId] = remote;
    connectFromCS[remote.sender.contextId].postMessage({greeting: "(background) Salut script de contenu Nous sommes connecté !"});
    connectFromCS[remote.sender.contextId].onMessage.addListener(function (msg) {
        if (!msg.hasOwnProperty('error') && !msg.hasOwnProperty('finish')) {
            switch (remote.name) {
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
                    if(msg.hasOwnProperty("identification")){
                        Storage.setData("identification", JSON.parse(msg.identification));
                    }
                    //TODO prendre en charge les modifs des URL sur la page option
                    console.log("Merci ! La vérification est en cours ...");
                    console.log(msg);
                    launch();
                    main();
                    break;
                case("popup"):
                    Storage.hydrate();
                    remote.postMessage({'identification': JSON.stringify(Storage.identification)});
                    remote.postMessage({'news': JSON.stringify(Storage.news)});
                    break;
                default:
                    console.log("Aucune action pour le remote");
                    console.log(remote);
                    console.log("Le message reçu : ");
                    console.log(msg);
                    break
            }
        } else if (msg.hasOwnProperty('finish')) {
            console.log("(finish)Reponse du script : " + msg.finish);
            console.log("Je me deconnecte");
            chrome.tabs.executeScript({code: `document.querySelector('.deconnexion').click()`});
            chrome.tabs.executeScript({code: `document.querySelector('.btn-primary').click()`});
            //<button class="btn btn-primary" data-dismiss="modal" type="button">Quitter mon espace</button>
        } else {
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
function eventEspacePersonnel(remote, msg) {
    switch (true) {
        case msg.hasOwnProperty('connect'):
            console.log("Je t'envoie les URLs");
            remote.postMessage({URLs: JSON.stringify(URLs.homepage)});
            remote.postMessage({collectInfo: "Collect les infos"});
            break;
        case msg.hasOwnProperty('news'):
            console.log("J'ai bien reçu les infos");
            console.log(msg.news);
            let data = JSON.parse(msg.news);
            //Necessaire car l'information de la derniere actualisation n'est plus disponible sur le site internet
            data.dateLastActualisation = dateLastActualisation.getDate() + ' ' + dateFrenchs[dateLastActualisation.getMonth()];
            Storage.setData('news', data);
            remote.postMessage({actualisation: "Lance l'actualisation"});
            break;
        case msg.hasOwnProperty('actualisation'):
            //// TODO: définir les urls Page de l'actualisation
            injectFileActiveTab(urlPage, pathScripts, 10);
            Storage.news.dateLastActualisation = dateLastActualisation.getDate() + ' ' + dateLastActualisation.getMonth();
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
function eventIdentification(remote, msg) {
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
