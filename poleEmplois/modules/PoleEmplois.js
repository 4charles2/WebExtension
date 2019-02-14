//Tableau des concordances avec le clavier de saisie du mot de passe poleemplois
/*  "toucheG": 8,
    "toucheH": 4,
    "toucheD": 2,
    "touhceC": 9,
    "toucheB": 3,
    "touhceI": 5,
    "toucheF": 7,
    "toucheJ": 6,
    "toucheA": 1,
    "toucheE": 0
];
*/


//Chaque lettre correspond à un chiffre et la lettre et presente dans la classe
//      == numero index  0    1    2    3    4    5    6    7    8    9
var keyboardPassword = ["E", "A", "D", "B", "H", "I", "J", "F", "G", "C"];
let URLs = {
  "identification":   "https://authentification-candidat.pole-emploi.fr/connexion/XUI/#login/&realm=%2Findividu&goto=https%3A%2F%2Fauthentification-candidat.pole-emploi.fr%2Fconnexion%2Foauth2%2Fauthorize%3Frealm%3D%252Findividu%26response_type%3Did_token%2520token%26scope%3Dopenid%2520idRci%2520profile%2520contexteAuthentification%2520email%2520courrier%2520notifications%2520etatcivil%2520logW%2520individu%2520pilote%2520nomenclature%2520coordonnees%2520navigation%2520reclamation%2520prdvl%2520idIdentiteExterne%26client_id%3DUSG_PN073-tdbcandidat_6408B42F17FC872440D4FF01BA6BAB16999CD903772C528808D1E6FA2B585CF2%26state%3DeD6N8ikP6PGPciAz%26nonce%3DqHx1uLZ9J6J-bIhb%26redirect_uri%3Dhttps%253A%252F%252Fcandidat.pole-emploi.fr%252Fespacepersonnel%252F",
  "espacePersonnel": "https://candidat.pole-emploi.fr/espacepersonnel/",
  "linkActrualisation": "a[href='https://authentification-candidat.pole-emploi.fr/compte/redirigervers?url=https://actualisation-authent.pole-emploi.fr/acces.htm&actu=true']"
}

console.log("Fichier Pole emplois");
export class PoleEmplois {

    static connection(chomeur){
        console.log("je tente la connection à pole emplois ");
          console.log(this);
          console.log(this.identification);
          setTimeout(() => {
              if(this.saisieIdentifiant(chomeur.login))
                  document.getElementById("submit").click();
          }, 3000);
          setTimeout(() => {
              if(this.saisiePassword(chomeur.password))
                  document.getElementById("codepostal").value = chomeur.codePostal;
                  document.getElementById("submit").click();
          }, 4000);
    }
    static actualisation(){
        var id = setInterval(function(){
            if(document.location == URLs.espacePersonnel ){
                let buttonActualisation = document.querySelector(URLs.linkActrualisation);
                if(buttonActualisation != undefined){
                  buttonActualisation.click();
                  console.log("J'ai cliquer sur actualisation");
                }else
                  console.log('Vous êtes déjà actualisé');

                clearInterval(id);

            }else
                console.log("Pas encore sur la page d'acceuil");
        }, 1000);
    }
    static saisiePassword(password){
      if(password != undefined){
        for(var i=0; i < password.length; i++){
            console.log(parseInt(password[i]));
            document.querySelector(".touche"+keyboardPassword[parseInt(password[i], 10)]).click();
        }
        return true;
      }else {
          console.log("password non definie");
          return false
        }
    }
    static saisieIdentifiant(login){
      if(login != undefined){
        document.getElementById("identifiant").value = login;
        return true;
      }else{
        console.log("login not defined");
        return false;
      }
    }
}
