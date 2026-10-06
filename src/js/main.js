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

// switch
const switchInput = document.querySelector(".theme-switch__input");

switchInput.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});
