/**
 * Tente d'injecter un script dans la page définie ci les URLs ne correspondent pas
 *  alors recursif toutes les 3 secondes j'usqu'à ce que nbTentative est > 0
 * @param  {[type]} newsURL     Url cible comparer avec activeTab.url
 * @param  {[type]} script      Path absolue ou relatif su script à injecter
 * @param  {[type]} nbTentative Le nombre de tentative avant abandon d'injection du script true > 0
 *
 */
export function injectFileActiveTab(newsURL, script, nbTentative) {
    chrome.tabs.query({"active": true, "currentWindow": true},
        function (tabs) {
        console.log(tabs);
            if (tabs[0].url == newsURL) {
                console.log("Sur la bonne page welcome home" + script);
                chrome.tabs.executeScript({
                    file: script
                });
            } else {
                console.log("URL non correspondante Vous n'êtes pas sur la bonne page !");
                console.log("l'url de la page : " + tabs[0].url + " ne correspond pas à l'url cible : " + newsURL);
                if (nbTentative > 0)
                    setTimeout(() => {
                        injectFileActiveTab(newsURL, script, --nbTentative);
                    }, 3000);
                else
                    console.log("Impossible de recuperer les infos sur les onglets" + newsURL);
                    console.log(tabs);
            }
        }
    );
}