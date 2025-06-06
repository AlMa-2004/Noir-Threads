window.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('input[name="tema"]').forEach(radio => { //toate elementele de tip input cu atributul name=tema
    // in loc sa iterez prin fiecare radio button din group cu un for, folosec functia forEach
    radio.addEventListener('change', function() {

      document.body.classList.remove("light", "dark", "alt");

      document.body.classList.add(this.value);

      localStorage.setItem("tema", this.value);
    });
  });
});
