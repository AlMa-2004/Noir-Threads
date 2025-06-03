window.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('input[name="tema"]').forEach(radio => {
    radio.addEventListener('change', function() {

      document.body.classList.remove("light", "dark", "alt");

      document.body.classList.add(this.value);

      localStorage.setItem("tema", this.value);
    });
  });
});
