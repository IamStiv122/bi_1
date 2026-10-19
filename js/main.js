// Utilidades compartidas para la navegación y el pie de página.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
      links.classList.toggle("is-open", !isOpen);
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú de navegación");
        links.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
});
