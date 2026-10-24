document.querySelectorAll(".acc-item").forEach((item, index) => {
  const button = item.querySelector("button");
  const panel = item.querySelector(".acc-panel");

  const setOpen = (open) => {
    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open);
    panel.inert = !open;
  };

  setOpen(index === 0 || item.classList.contains("is-open"));
  button.addEventListener("click", () => {
    setOpen(!item.classList.contains("is-open"));
  });
});

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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reduceMotion.matches) {
  document.querySelectorAll(".reel-video").forEach((video) => {
    video.pause();
    video.removeAttribute("autoplay");
  });
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (reduceMotion.matches) return;
    isIntersecting ? target.play().catch(() => {}) : target.pause();
  });
});

document
  .querySelectorAll(".reel-video")
  .forEach((video) => observer.observe(video));
