let connectFromCS = [];

export default class OnMessage {
  static recepConnected(typeMsg){
    browser.runtime.onConnect.addListener((remote) => {
      this.connected(remote, typeMsg == "notification" ? this.showNotify : this.showMsg);
    });
  }
  static connected(remote, displayMsg){
    connectFromCS[remote.sender.tab.id] = remote;
    connectFromCS[remote.sender.tab.id].postMessage({greeting: "(background) Salut script de contenu !"});
    connectFromCS[remote.sender.tab.id].onMessage.addListener(function(msg){
        displayMsg(msg, remote);
    });
  }
  static sendMessage(msg, tabID){
    if (tabID == null)
        connectFromCS.forEach(remote => {
        remote.postMessage(msg);
      });
      else
        connectFromCS[tabID].postMessage(msg);
  }
  static showMsg(msg, remote){
      console.log("Dans le script d'arrière plan, reception d'un message du script de contenu " + msg);
      console.log("Il s'agit du script : " + JSON.stringify(remote));
      console.log(msg);
  }
  static showNotify(msg, remote){
      browser.notifications.create("notification",{
        "type": "basic",
        "title": "Vous avez une notification de la web Extension",
        "message": msg
      });
  }
}
