import createAlertBox from "./create-alertbox.js";

export default function handleContactsFormSubmit(event) {
  const form = event.target;
  if (!form.matches("#contacts-form")) return;

  event.preventDefault();

  // === Валидація ===
  const requiredFields = Array.from(form.elements).filter((el) => el.required);
  const firstInvalid = requiredFields.find((el) => !el.checkValidity());

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // === Сбор данных ===
  const formData = new FormData(form);
  const name = formData.get("name") || "";
  const email = formData.get("e-mail") || "";
  const message = formData.get("message") || "";

  const queryParams = new URLSearchParams(formData).toString();
  const targetUrl = form.getAttribute("action") || window.location.pathname;
  fetch(`${targetUrl}?${queryParams}`, { method: "GET" })
    .then((res) => {
      if (!res.ok) throw new Error("Запит не вдався");
      return res.text();
    })
    .then(() => {
      const alertMessage = `Дякуємо, ${name}! Ваше повідомлення надіслано. Ми відповімо на ${email}.`;
      createAlertBox(form, alertMessage);
      form.reset();
      form.querySelector("button[type='submit']")?.blur();
    })
    .catch((error) => {
      console.error("❌ Помилка GET-запиту:", error);
      createAlertBox(form, "Сталася помилка при відправці форми.");
    });
}
