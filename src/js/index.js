import Tilt3D from "./modules/tilt3d.js";
import initPopup from "./modules/popup.js";
import "./modules/validation-form.js";
import IMask from "./modules/imask.js";
import handleContactsFormSubmit from "./modules/messenge-submit.js";
import initOrderConfirmation from "./modules/initOrderConfirmation.js";

document.addEventListener("DOMContentLoaded", () => {
  // Tilt3D
  document.querySelectorAll(".tilt3d-container").forEach((container) => {
    const inner = container.querySelector(".tilt3d-inner");
    if (inner) {
      const tilt = new Tilt3D(container, inner);
      tilt.init();
    }
  });

  // Popup
  initPopup();
  // Показ подтверждения заказа, если есть параметры

  initOrderConfirmation();

  // Contacts form
  const contactsForm = document.getElementById("contacts-form");
  if (contactsForm) {
    contactsForm.addEventListener("submit", handleContactsFormSubmit);
  }

  // Burger menu
  const burgerButton = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  function setMenuState(expanded) {
    if (burgerButton && nav) {
      burgerButton.setAttribute("aria-expanded", String(expanded));
      nav.setAttribute("aria-expanded", String(expanded));
      document.body.style.overflow = expanded ? "hidden" : "";
    }
  }

  if (burgerButton && nav) {
    burgerButton.addEventListener("click", () => {
      const isExpanded = burgerButton.getAttribute("aria-expanded") === "true";
      setMenuState(!isExpanded);
    });
  }

  // Закрытие меню и плавный переход по якорям
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (
        burgerButton &&
        nav &&
        burgerButton.getAttribute("aria-expanded") === "true"
      ) {
        setMenuState(false);
      }

      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerOffset = 80;
          const offsetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    });
  });
});
