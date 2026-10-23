const navItems = document.querySelectorAll(".nav-item");
navItems.forEach((navitem) => {
  const dropdown = navitem.querySelector(".dropdown-menu");
  const navButton = navitem.querySelector(".body-large");

  navButton.addEventListener("click", () => {
    const dropdowns = document.querySelectorAll(".dropdown-menu");
    dropdowns.forEach((down) => {
      if (down !== dropdown) {
        down.classList.remove("open");
      }
    });

    dropdown.classList.toggle("open");
  });
});

// Si nous avons le temps, nous ajoutons des transitions

<<<<<<< HEAD
// switch
const switchInput = document.querySelector(".theme-switch-input");
=======
// ───────────── SWITCH DARK MODE ─────────────
const switchInput = document.querySelector(".theme-switch__input");
if (switchInput) {
  const root = document.documentElement;
>>>>>>> e5e0a54231f3afd379b6d0340189886e536647b5

  // Synchronise le switch avec le mode actuel
  switchInput.checked = root.dataset.mode === "dark";

  switchInput.addEventListener("change", () => {
    const mode = switchInput.checked ? "dark" : "light";
    root.dataset.mode = mode;
    localStorage.setItem("mode", mode);
  });
}
