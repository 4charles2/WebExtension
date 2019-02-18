console.log("coucou je vais recuperer les infos ici");
/*
let urlButtonActualisation = "a[href='https://authentification-candidat.pole-emploi.fr/compte/redirigervers?url=https://actualisation-authent.pole-emploi.fr/acces.htm&actu=true']";
let urlEspacePerso = "https://candidat.pole-emploi.fr/espacepersonnel/"
*/
var URLs;

var myRuntime = chrome.runtime.connect({name: "EspacePersonnel"});
myRuntime.postMessage({connect: "(Script de contenu) homepage.js Je te reçoit runtime"});

//Reçoit les messages du runtime
myRuntime.onMessage.addListener(function (msg) {
    switch (true) {
        case msg.hasOwnProperty('URLs'):
            console.log("j'ai reçu les URLs");
            URLs = JSON.parse(msg.URLs);
            break;
        case msg.hasOwnProperty('collectInfo'):
            if (document.readyState === "complete") {
                console.log("Je collecte les infos -----");
                myRuntime.postMessage({news: JSON.stringify(collectInfo())});
            } else {
                document.addEventListener('readystatechange', (evt) => {
                    if (evt.target.readyState === "complete") {
                        console.log("Premiere tentative echoue");
                        setTimeout(() => {
                            myRuntime.postMessage({news: JSON.stringify(collectInfo())});
                        }, 3000);
                    } else {
                        console.log("Je patiente que le document finisse de charger");
                    }
                });
            }
            break;
        case msg.hasOwnProperty('actualisation'):
            myRuntime.postMessage({greeting: "Ok je lance l'actualisation"});
            myRuntime.postMessage(actualisation(URLs.urlEspacePerso, URLs.urlButtonActualisation));
            break;
        default:
            console.log("Message du runtime");
            console.log(msg);
            break;
    }
});

/**
 * collect les infos sur la page Espace personnel
 *
 * @return {JSON} Return un object JSON avec les données collecte
 */
function collectInfo() {
    console.log("Dans la fonction collectInfo()");
    //Data JSON qui seront stocké
    let infos = {
        "dateNextActualisation": "",
        "dateLastPaiement": "",
        "montantLastPaiement": "",
        "countCourrier": ""
    };
    //Je recupere toutes les div .infos dans le .container-situation
    var divInfos = document.querySelectorAll('.container-situation .info');
    //Je recupere le nombre de courrier non lues .notification-bubble[0]
    var bubbleCourrier = document.querySelector('.notification-bubble');
    infos.dateNextActualisation = divInfos[0].firstChild.textContent.split('le')[1].split('et')[0];
    //N'existe plus c'etais une div en dessous de la prochaine date d'actualisation
    //infos.dateNextActualisation = divInfos[0].nextSibling.firstChild.textContent.split('le')[1].split('et')[0];
    infos.dateLastPaiement = divInfos[2].firstChild.nodeValue.split('le')[1];
    infos.montantLastPaiement = divInfos[2].firstChild.nodeValue.split(' ')[3];
    infos.countCourrier = bubbleCourrier.firstChild.nodeValue;
    console.log("Je te retourne les infos suivantes");
    console.log(infos);
    return infos;
}

/**
 * * clique sur le boutton actualisation s'il existe
 * @param  {[type]} urlEspacePerso         URL Homepage
 * @param  {[type]} urlButtonActualisation URL cible du button Actualisation
 *
 */
function actualisation(urlEspacePerso, urlButtonActualisation) {
    console.log(document.location.href + urlEspacePerso);
    if (document.location.href === urlEspacePerso) {
        let buttonActualisation = document.querySelector(urlButtonActualisation);
        if (buttonActualisation != undefined) {
            buttonActualisation.click();
            return {actualisation: "J'ai cliquer sur actualisation"};
        } else
            return {finish: 'Vous êtes déjà actualisé'};
    } else
        return {error: "Vous n'êtes sur la bonne page pour lancer l'actualisation"};

}
