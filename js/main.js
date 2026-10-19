// Aplica enseguida el tema guardado para evitar un destello con el tema incorrecto.
const themeStorageKey = "dataclara-theme";

try {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (error) {
  console.warn("No se pudo leer la preferencia de tema guardada.", error);
}

// Utilidades compartidas para navegación, tema y pie de página.
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

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const syncThemeToggle = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Cambiar a tema ${isDark ? "claro" : "oscuro"}`);
    themeToggle.innerHTML = `<i class="bi ${isDark ? "bi-sun" : "bi-moon-stars"}" aria-hidden="true"></i><span>Tema ${isDark ? "claro" : "oscuro"}</span>`;
  };

  if (themeToggle) {
    syncThemeToggle();
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch (error) {
        console.warn("No se pudo guardar la preferencia de tema.", error);
      }
      syncThemeToggle();
      window.dispatchEvent(new CustomEvent("dataclara:themechange", { detail: { theme: nextTheme } }));
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
});
