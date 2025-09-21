document.addEventListener("DOMContentLoaded", function () {
  const burgerButton = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  burgerButton.addEventListener("click", function () {
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
    nav.setAttribute("aria-expanded", !isExpanded);
  });
});
