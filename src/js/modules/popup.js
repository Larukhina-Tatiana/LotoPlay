export default function initPopup() {
  const triggers = document.querySelectorAll(".popup-trigger");
  const popup = document.getElementById("popup-buy");
  const closeBtn = popup.querySelector(".popup__close");
  const overlay = popup.querySelector(".popup__overlay");

  const form = document.getElementById("order__form");
  const cityInput = form.querySelector("#concert-city");
  const venueInput = form.querySelector("#concert-venue");
  const datetimeInput = form.querySelector("#concert-datetime");

  const concertInfo = popup.querySelector("#concert-info"); // если отображаешь в заголовке

  const openPopup = (btn) => {
    const city = btn.dataset.city || "";
    const venue = btn.dataset.venue || "";
    const datetime = btn.dataset.datetime || "";

    cityInput.value = city;
    venueInput.value = venue;
    datetimeInput.value = datetime;

    if (concertInfo) {
      concertInfo.textContent = `${city} — ${venue}, ${datetime}`;
    }

    document.body.classList.add("popup-open");
    popup.classList.add("is-visible");
  };

  const closePopup = () => {
    document.body.classList.remove("popup-open");
    popup.classList.remove("is-visible");
  };

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => openPopup(btn));
  });

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });
}
