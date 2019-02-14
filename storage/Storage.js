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
        if(this.identification.identifiant !== null && this.identification.password !== null && this.identification.codePostal != null)
          return true;
      return false;
    }
    static exist(id){
        if(this.getData(id))
          return (id == 'identification' ? this.identificationVerif() : true);
      return false;
    }
    static setData(dataName, data){
      localStorage.setItem(dataName, JSON.stringify(data));
    }
    static getData(dataName){
      let data = localStorage.getItem(dataName);
      if(data != null && data != "undefined")
        return this[dataName] = JSON.parse(data);
      else
        return this[dataName] = false;
    }
}
