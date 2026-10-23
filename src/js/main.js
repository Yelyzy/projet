const navItems = document.querySelectorAll(".nav-item");
navItems.forEach((navitem) => {
  const dropdown = navitem.querySelector(".dropdown-menu");
  const navButton = navitem.querySelector(".body-large");

  if (!dropdown || !navButton) return;

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

const switchInput = document.querySelector(".theme-switch__input");
if (switchInput) {
  const root = document.documentElement;
  const savedMode = localStorage.getItem("mode");
  const mode = savedMode === "dark" ? "dark" : "light";

  root.dataset.mode = mode;
  switchInput.checked = mode === "dark";

  switchInput.addEventListener("change", () => {
    const selectedMode = switchInput.checked ? "dark" : "light";
    root.dataset.mode = selectedMode;
    localStorage.setItem("mode", selectedMode);
  });
}
