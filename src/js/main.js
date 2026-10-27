// ==========================================================
// Accordion (FAQ)
// ==========================================================
const accItems = document.querySelectorAll(".acc-item");

const setAccOpen = (item, open) => {
  item.classList.toggle("is-open", open);
  item.querySelector("button").setAttribute("aria-expanded", String(open));
  item.querySelector(".acc-panel").inert = !open;
};

accItems.forEach((item) => {
  item.querySelector("button").addEventListener("click", () => {
    const willOpen = !item.classList.contains("is-open");

    // fermer tous les autres questions
    accItems.forEach((other) => {
      if (other !== item) setAccOpen(other, false);
    });

    setAccOpen(item, willOpen);
  });
});

// Lors du chargement, une seule question est ouverte : celle marquée « is-open » ; s'il n'y en a pas, c'est la première.
const initiallyOpen =
  document.querySelector(".acc-item.is-open") || accItems[0];

accItems.forEach((item) => setAccOpen(item, item === initiallyOpen));

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

const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-nav");
const mobileMenuItems = document.querySelectorAll(".mobile-nav__item");
const mobileScreen = window.matchMedia("(max-width: 44rem)");

mobileMenuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("mobile-menu-open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu",
  );
});

mobileMenuItems.forEach((item) => {
  const button = item.querySelector("button");
  const submenu = item.querySelector("ul");

  button.addEventListener("click", () => {
    const isOpen = submenu.hidden;

    mobileMenuItems.forEach((otherItem) => {
      otherItem.querySelector("ul").hidden = true;
      const otherButton = otherItem.querySelector("button");
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.classList.replace("body-semibold", "body-large");
    });

    submenu.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));
    button.classList.replace(
      isOpen ? "body-large" : "body-semibold",
      isOpen ? "body-semibold" : "body-large",
    );
  });
});

mobileMenu?.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  document.body.classList.remove("mobile-menu-open");
  mobileMenuButton?.setAttribute("aria-expanded", "false");
  mobileMenuButton?.setAttribute("aria-label", "Open menu");
});

mobileScreen.addEventListener("change", (event) => {
  if (event.matches) return;
  document.body.classList.remove("mobile-menu-open");
  mobileMenuButton?.setAttribute("aria-expanded", "false");
  mobileMenuButton?.setAttribute("aria-label", "Open menu");
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

// Desktop et tablette
const isWide = window.matchMedia("(min-width: 37.5rem)");

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

const setOpen = (card, isOpen) => {
  card.classList.toggle("is-open", isOpen);
  card
    .querySelector(":scope > button")
    .setAttribute("aria-expanded", String(isOpen));
  card.querySelector(".article-card-open").hidden = !isOpen;
  if (isOpen) fitExcerpt(card);
};

const moveToMiddle = (card) => {
  const section = card.parentElement;
  const cards = [...section.querySelectorAll(":scope > .article-card")];
  if (cards.length < 3) return;

  const before = new Map(cards.map((c) => [c, c.getBoundingClientRect().top]));

  const shift = (cards.indexOf(card) - 1 + cards.length) % cards.length;
  const rotated = [...cards.slice(shift), ...cards.slice(0, shift)];
  rotated.forEach((c) => section.append(c));

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
    card.parentElement.querySelectorAll(".article-card").forEach((other) => {
      if (other !== card) setOpen(other, false);
    });

    setOpen(card, true);

    if (isWide.matches) moveToMiddle(card);

    const title = panel.querySelector("h4");
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
  });
});

// При загрузке (десктоп и планшет) открыта средняя карточка
if (isWide.matches) {
  document.querySelectorAll(".rubrique").forEach((section) => {
    const cards = section.querySelectorAll(":scope > .article-card");
    if (cards.length >= 3) setOpen(cards[1], true);
  });
}
