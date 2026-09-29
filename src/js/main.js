const navItems = document.querySelectorAll(".nav-item");

function closeMenu(navItem) {
	navItem.classList.remove("is-open");
	navItem.querySelector(".trigger").setAttribute("aria-expanded", "false");
	navItem.querySelector(".dropdown-menu").setAttribute("aria-hidden", "true");
}

navItems.forEach((navItem) => {
	const trigger = navItem.querySelector(".trigger");
	const menu = navItem.querySelector(".dropdown-menu");

	trigger.addEventListener("click", () => {
		const willOpen = !navItem.classList.contains("is-open");

		navItems.forEach(closeMenu);

		if (willOpen) {
			navItem.classList.add("is-open");
			trigger.setAttribute("aria-expanded", "true");
			menu.setAttribute("aria-hidden", "false");
		}
	});
});

document.addEventListener("click", (event) => {
	if (!event.target.closest(".main-nav")) {
		navItems.forEach(closeMenu);
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		navItems.forEach(closeMenu);
	}
});
