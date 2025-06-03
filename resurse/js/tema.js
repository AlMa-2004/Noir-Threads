const temaSalvata = localStorage.getItem("tema");
if (temaSalvata) {
  document.body.classList.add(temaSalvata);
}
