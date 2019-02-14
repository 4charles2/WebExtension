var id_datas = [
  "identification",
  "params",
  "news"
];

export class Storage {
    static hydrate(){
      for(var id of id_datas)
        console.log(id + " : " + this.exist(id));
    }
    static identificationVerif(){
        return this.identification.codePostal != null && this.identification.password !== null && this.identification.identifiant !== null;
    }
    static exist(param){
        if(this.getData(param))
          return (param === 'identification' ? this.identificationVerif() : true);
      return false;
    }
    static setData(dataName, data){
      localStorage.setItem(dataName, JSON.stringify(data));
    }
    static getData(dataName){
      let data = localStorage.getItem(dataName);
      if(data != null && data !== "undefined")
        return this[dataName] = JSON.parse(data);
      else
        return this[dataName] = false;
    }
}
