import {Storage} from "/storage/storage.js"

let menuElmnt = document.getElementById("menu");

if (Storage.exist('news')){
  for (let info in Storage.news)
    document.getElementById(info).textContent = Storage.news[info];
}

if (Storage.exist('identification')){
  menuElmnt.style.display = "block";
  document.getElementById("msg").remove();
}
else {
  menuElmnt.style.display = "none";
}

var aLink = document.getElementById("options_page");
aLink.addEventListener("click", function() {
  browser.runtime.openOptionsPage();
});
