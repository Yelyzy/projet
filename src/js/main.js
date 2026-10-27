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

// ==========================================================
// Article card
// ==========================================================

// Десктоп и планшет: от 600px. На мобильном карточки не переставляются.
const isWide = window.matchMedia("(min-width: 37.5rem)");

// Сколько строк текста помещается в открытой карточке: 3 или 2
const fitExcerpt = (card) => {
  const panel = card.querySelector(".article-card-open");
  const content = card.querySelector(".article-card-content");
  const text = content.querySelector(":scope > .body-regular");
  if (panel.hidden || !text) return;

  for (let lines = 3; lines >= 2; lines--) {
    text.style.webkitLineClamp = lines;
    if (content.scrollHeight <= content.clientHeight) break;
  }
};

// Открыть или закрыть карточку
const setOpen = (card, isOpen) => {
  card.classList.toggle("is-open", isOpen);
  card
    .querySelector(":scope > button")
    .setAttribute("aria-expanded", String(isOpen));
  card.querySelector(".article-card-open").hidden = !isOpen;
  if (isOpen) fitExcerpt(card);
};

// Переставить карточки по кругу, чтобы выбранная оказалась второй (в центре)
const moveToMiddle = (card) => {
  const section = card.parentElement;
  const cards = [...section.querySelectorAll(":scope > .article-card")];
  if (cards.length < 3) return;

  // запоминаем, где карточки стоят сейчас
  const before = new Map(cards.map((c) => [c, c.getBoundingClientRect().top]));

  // новый порядок: выбранная карточка на втором месте, остальные по кругу
  const shift = (cards.indexOf(card) - 1 + cards.length) % cards.length;
  const rotated = [...cards.slice(shift), ...cards.slice(0, shift)];
  rotated.forEach((c) => section.append(c));

  // плавно довозим каждую карточку со старого места на новое
  if (reduceMotion.matches) return;
  rotated.forEach((c) => {
    const dy = before.get(c) - c.getBoundingClientRect().top;
    if (!dy) return;
    c.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], {
      duration: 450,
      easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    });
  });
};

// Пересчитывать строки, когда меняется ширина карточки
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => fitExcerpt(entry.target.closest(".article-card")));
});

document.querySelectorAll(".article-card").forEach((card, index) => {
  const toggle = card.querySelector(":scope > button");
  const panel = card.querySelector(".article-card-open");

  const id = `article-${index + 1}`;
  panel.id = id;
  toggle.setAttribute("aria-controls", id);

  resizeObserver.observe(card.querySelector(".article-card-content"));

  toggle.addEventListener("click", () => {
    // в рубрике открыта только одна карточка
    card.parentElement.querySelectorAll(".article-card").forEach((other) => {
      if (other !== card) setOpen(other, false);
    });

    setOpen(card, true);

    // десктоп и планшет: открытая карточка встаёт в центр стопки
    if (isWide.matches) moveToMiddle(card);

    const title = panel.querySelector("h4");
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
  });
});
