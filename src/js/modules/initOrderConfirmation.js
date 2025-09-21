import createAlertBox from "./create-alertbox.js";

export default function initOrderConfirmation() {
  // console.log("📦 initOrderConfirmation.js загружен");

  const params = new URLSearchParams(window.location.search);
  const city = params.get("concert-city");
  const venue = params.get("concert-venue");
  const datetime = params.get("concert-datetime");
  const tickets = params.get("ticket-count");
  // console.log("🎯 Проверка параметров:");
  // console.log("concert-city:", city);
  // console.log("concert-venue:", venue);
  // console.log("concert-datetime:", datetime);
  // console.log("ticket-count:", tickets);

  if (city && venue && datetime && tickets) {
    // console.log("Параметры найдены:", { city, venue, datetime, tickets });

    if (window.__orderAlertShown) return;
    window.__orderAlertShown = true;

    const form = document.querySelector("#order__form") || document.body;
    const message = `
      ✅ Ваше замовлення підтверджено<br>
      <strong>Місто:</strong> ${city}<br>
      <strong>Місце:</strong> ${venue}<br>
      <strong>Дата і час:</strong> ${datetime}<br>
      <strong>Кількість квитків:</strong> ${tickets}
    `;
    createAlertBox(form, message);

    // Очищаем URL от параметров
    const cleanUrl =
      window.location.origin + window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}
