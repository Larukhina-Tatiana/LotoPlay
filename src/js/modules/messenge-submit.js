import createAlertBox from "./create-alertbox.js";

export default function handleContactsFormSubmit(event) {
  const form = event.target;
  if (!form.matches("#contacts-form")) return;

  event.preventDefault();

  // Просто показываем alertBox, не отправляем fetch
  const name = form.elements["name"].value || "";
  const email = form.elements["e-mail"].value || "";
  const alertMessage = `Дякуємо, ${name}! Ваше повідомлення надіслано. Ми відповімо на ${email}.`;
  createAlertBox(form, alertMessage);
  form.reset();
  form.querySelector("button[type='submit']")?.blur();
}
