function createAlertBox(form, message = "Заявку успішно відправлено!") {
  // console.log("🚀 Вызов createAlertBox");

  const alertBox = document.createElement("div");
  alertBox.classList.add("form-alert");
  alertBox.setAttribute("role", "alert");
  alertBox.setAttribute("aria-live", "polite");

  const text = document.createElement("span");
  text.classList.add("form-alert__text");
  text.innerHTML = message;

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("form-alert__close");
  closeBtn.setAttribute("type", "button");
  closeBtn.setAttribute("aria-label", "Закрити повідомлення");
  closeBtn.innerHTML = "&times;";

  let timeoutId;

  const handleOutsideClick = (e) => {
    if (!alertBox.contains(e.target)) {
      removeAlert();
    }
  };

  // === Удаление
  const removeAlert = () => {
    clearTimeout(timeoutId);
    alertBox.remove();
    document.removeEventListener("click", handleOutsideClick);
  };

  // === Клик по кнопке
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeAlert();
  });

  alertBox.appendChild(text);
  alertBox.appendChild(closeBtn);
  // form.appendChild(alertBox);
  document.body.appendChild(alertBox);

  // === Таймер
  timeoutId = setTimeout(removeAlert, 5000);

  // Добавляем слушатель на весь документ с небольшой задержкой
  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick);
  }, 0);
}

export default createAlertBox;
