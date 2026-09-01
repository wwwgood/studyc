var focusPh = null;
var focusCard = null;
function openFocus(card){
  var mask = document.getElementById("focusMask");
  if (!card || mask.classList.contains("open")) return;
  focusPh = document.createElement("div"); focusPh.className = "focus-ph";
  card.parentNode.insertBefore(focusPh, card);
  card.classList.add("is-focused");
  focusCard = card;
  document.getElementById("focusBody").appendChild(card);
  var h3 = card.querySelector("h3");
  var tn = h3 && h3.firstChild ? h3.firstChild.textContent : "";
  document.getElementById("focusTitle").textContent = (tn || (h3 ? h3.textContent : "专注练习")).trim();
  mask.classList.add("open");
  document.body.classList.add("mask-open");
}
function closeFocus(){
  var mask = document.getElementById("focusMask");
  var card = focusCard; focusCard = null;
  if (card && focusPh && focusPh.parentNode) focusPh.parentNode.insertBefore(card, focusPh);
  if (focusPh) focusPh.remove(); focusPh = null;
  if (card) card.classList.remove("is-focused");
  card = null;
  mask.classList.remove("open");
  document.body.classList.remove("mask-open");
}
function bindFocus(){
  document.querySelectorAll(".focus-btn").forEach(function(b){
    b.addEventListener("click", function(){ openFocus(b.closest(".train-card")); });
  });
  var cc = document.getElementById("focusClose");
  if (cc) cc.addEventListener("click", closeFocus);
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && document.getElementById("focusMask").classList.contains("open")) closeFocus();
  });
}
