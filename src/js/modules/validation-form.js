import createAlertBox from "./create-alertbox.js";
import initOrderConfirmation from "./initOrderConfirmation.js";
import FormStorage from "./form-storage.js";

// Генерация ключа для хранения данных формы в localStorage
const getStorageKey = (form) =>
  "form-storage:" + (form.getAttribute("name") || form.id || "default");

// Основная точка входа — после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  // Проверка, был ли уже инициализирован FormsValidation
  if (window.__formsValidationInitialized) return;
  window.__formsValidationInitialized = true;

  // === Класс кастомной валидации формы ===
  class FormsValidation {
    // Селекторы для поиска форм и контейнеров ошибок
    selectors = {
      form: "[data-js-form]",
      fieldErrors: "[data-js-form-field-errors]",
    };

    // Сообщения об ошибках по типу HTML5-валидации
    errorMessages = {
      valueMissing: () => "Будь ласка, заповніть це поле!",
      typeMismatch: (el) => "Невірний формат",
      patternMismatch: ({ title }) => title || "Невірний формат даних",
      tooShort: ({ minLength }) => `Мінімум символів — ${minLength}`,
      tooLong: ({ maxLength }) => `Максимум символів — ${maxLength}`,
      rangeUnderflow: ({ min }) => `Значення має бути не менше ${min}.`,
      rangeOverflow: ({ max }) => `Значення має бути не більше ${max}.`,
      stepMismatch: ({ step }) => `Значення має бути кратним ${step}.`,
      badInput: () => "Введено некоректне число",
    };

    constructor() {
      // Привязываем обработчики событий и связываем поля с контейнерами ошибок
      this.bindEvents();
      this.bindAccessibility();
    }

    /**
     * Связывает input с контейнером ошибок через aria-errormessage
     * @returns {void}
     */
    bindAccessibility() {
      document.querySelectorAll(this.selectors.form).forEach((form) => {
        const formId = form.getAttribute("name") || form.id || "form";
        form.querySelectorAll("[required]").forEach((input) => {
          const name = input.getAttribute("name");
          if (!name) return; // Пропускаем поля без имени

          // Ищем контейнер для ошибок: сначала по ID, затем в label, затем в fieldset
          const errorSpan =
            form.querySelector(`#${formId}-${name}-error`) ||
            input.closest("label")?.querySelector(this.selectors.fieldErrors) ||
            input
              .closest("fieldset")
              ?.querySelector(this.selectors.fieldErrors);

          if (errorSpan) {
            // Генерируем уникальный ID для контейнера ошибок, если его еще нет
            const uniqueId = errorSpan.id || `${formId}-${name}-error`;
            errorSpan.id = uniqueId;
            // Связываем поле с его контейнером ошибок через aria-errormessage
            input.setAttribute("aria-errormessage", uniqueId);
          }
        });
      });
    }

    /**
     * Отображает сообщения об ошибках для поля в DOM
     * @param {HTMLElement} formControlElement - элемент формы (input, textarea, checkbox)
     * @param {string[]} errorMessages - массив сообщений об ошибках
     * @returns {void}
     */
    manageErrors(formControlElement, errorMessages) {
      // Получаем ID контейнера ошибок из атрибута aria-errormessage
      const errorId = formControlElement.getAttribute("aria-errormessage");
      if (!errorId) return;

      const fieldErrorsElement = document.getElementById(errorId);

      if (fieldErrorsElement) {
        // Вставляем сообщения об ошибках в контейнер
        fieldErrorsElement.innerHTML = errorMessages
          .map((msg) => `<span class="form-error">${msg}</span>`)
          .join("");
      }
    }

    /**
     * Генерирует массив сообщений об ошибках для поля
     * @param {HTMLElement} formControlElement - элемент формы
     * @returns {string[]} - массив сообщений
     */
    getErrorMessages(formControlElement) {
      const errors = formControlElement.validity;
      const messages = [];

      Object.entries(this.errorMessages).forEach(([type, getMessage]) => {
        if (errors[type]) messages.push(getMessage(formControlElement));
      });

      return messages;
    }

    /**
     * Проверяет валидность поля, обновляет классы и отображает ошибки
     * @param {HTMLElement} formControlElement - элемент формы
     * @returns {boolean} - валидно ли поле
     */
    validateField(formControlElement) {
      // Получаем сообщения об ошибках через отдельную функцию
      const errorMessages = this.getErrorMessages(formControlElement);

      // Определяем валидность поля
      const isValid = errorMessages.length === 0;

      // Обновляем атрибуты и классы для визуальной индикации
      formControlElement.setAttribute("aria-invalid", !isValid);
      formControlElement.classList.toggle("is-valid", isValid);
      formControlElement.classList.toggle("is-invalid", !isValid);

      // Показываем ошибки в DOM
      this.manageErrors(formControlElement, errorMessages);

      return isValid;
    }

    /**
     * Очищает ошибки и классы при фокусе на поле
     * @param {FocusEvent} event
     * @returns {void}
     */
    onFocus(event) {
      const { target } = event;
      // Проверяем, что target — это элемент
      if (!(target instanceof HTMLElement)) return;

      const form = target.closest(this.selectors.form);

      // Работаем только с обязательными полями внутри наших форм
      if (!form || !target.required) return;

      // Сбрасываем классы валидации с самого элемента
      target.classList.remove("is-valid", "is-invalid");
      target.setAttribute("aria-invalid", "false");

      // Очищаем сообщение об ошибке
      this.manageErrors(target, []);
    }

    /**
     * Валидирует поле при потере фокуса
     * @param {FocusEvent} event
     * @returns {void}
     */
    onBlur(event) {
      const { target } = event;
      // Проверяем, что target — это элемент
      if (!(target instanceof HTMLElement)) return;

      const form = target.closest(this.selectors.form);

      // Работаем только с обязательными полями внутри наших форм
      if (!form || !target.required) return;

      // Валидируем поле
      this.validateField(target);
    }

    /**
     * Валидирует поле при изменении значения
     * @param {Event} event
     * @returns {void}
     */
    onChange(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);

      // Работаем только с обязательными полями внутри наших форм
      if (!form || !target.required) return;

      // Валидируем поле
      this.validateField(target);
    }

    /**
     * Обрабатывает отправку формы: валидация, сбор данных, сброс, алерт
     * @param {SubmitEvent} event
     * @returns {Promise<void>}
     */
    async onSubmit(event) {
      const form = event.target;

      // Проверяем, что событие произошло на целевой форме
      if (!form.matches(this.selectors.form)) return;

      // Отменяем стандартную отправку формы
      event.preventDefault();

      // Получаем ключ для хранения данных формы в localStorage
      const storageKey = getStorageKey(form);

      // Собираем все элементы формы, которые подлежат валидации
      const fieldsToValidate = [...form.elements].filter(
        (el) => el.willValidate
      );

      let isFormValid = true;
      let firstInvalid = null;

      // Валидация всех полей формы
      fieldsToValidate.forEach((el) => {
        const isFieldValid = this.validateField(el);
        if (!isFieldValid) {
          isFormValid = false;
          if (!firstInvalid) firstInvalid = el;
        }
      });

      // Если есть ошибки — фокусируемся на первом невалидном поле
      if (!isFormValid) {
        firstInvalid?.focus();
        return;
      }

      // Получаем сохранённые данные из localStorage
      let savedData = null;
      try {
        savedData = localStorage.getItem(storageKey);
      } catch (error) {
        console.error("Ошибка чтения из localStorage:", error);
      }

      // Очищаем и нормализуем данные
      const rawData = savedData ? JSON.parse(savedData) : {};
      const cleanedData = {};
      for (let key in rawData) {
        const value = rawData[key];
        cleanedData[key] =
          typeof value === "string"
            ? value
                .replace(/^\s+|\s+$/g, "")
                .replace(/\n{2,}/g, "\n")
                .trim()
            : value;
      }

      // Проверяем, содержит ли форма концертные поля
      const concertCity = form.querySelector("#concert-city")?.value;
      const concertVenue = form.querySelector("#concert-venue")?.value;
      const concertDatetime = form.querySelector("#concert-datetime")?.value;

      const isConcertForm = concertCity && concertVenue && concertDatetime;

      if (isConcertForm) {
        // Добавляем данные о концерте
        cleanedData["concert-city"] = concertCity;
        cleanedData["concert-venue"] = concertVenue;
        cleanedData["concert-datetime"] = concertDatetime;

        // Формируем строку параметров для URL
        const queryParams = new URLSearchParams(cleanedData).toString();
        const targetUrl = "/index.html"; // ← фиксируем путь

        // Меняем адресную строку без перезагрузки страницы
        window.history.pushState({}, "", `${targetUrl}?${queryParams}`);

        window.__orderAlertShown = false; // Сброс флага!
        initOrderConfirmation();
      }

      // === Универсальные действия для всех форм ===

      // Очищаем localStorage
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Ошибка удаления из localStorage:", error);
      }

      // Сброс формы и снятие фокуса с кнопки
      this.resetForm(form);
    }

    /**
     * Унифицированный сброс формы: значения, ошибки, фокус, политика, попап
     * @param {HTMLFormElement} form
     * @returns {void}
     */
    resetForm(form) {
      // Сброс значений формы
      form.reset();

      // Снятие фокуса с кнопки отправки
      form.querySelector("button[type='submit']")?.blur();

      // Очистка ошибок для всех полей
      form.querySelectorAll("[required]").forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
        input.setAttribute("aria-invalid", "false");
        this.manageErrors(input, []);
      });

      // Сброс чекбокса политики, если он есть
      const policyCheckbox = form.querySelector(".js-policy-checkbox");
      if (policyCheckbox) policyCheckbox.checked = true;

      // Закрытие попапа, если форма в нем
      const popup = form.closest(".popup, .modal, .dialog");
      if (popup) {
        popup.classList.remove("is-visible", "is-active", "is-open");
        popup.setAttribute("aria-hidden", "true");
      }

      // Закрытие оверлея, если он есть
      const overlay = document.querySelector(
        ".popup-overlay, .modal-backdrop, .overlay"
      );
      if (overlay) {
        overlay.classList.remove("is-visible", "active");
        overlay.style.display = "none";
        overlay.setAttribute("aria-hidden", "true");
      }

      // Разблокировка прокрутки и взаимодействия
      document.body.classList.remove("popup-open");
      document.body.style.overflow = "";
      document.body.style.touchAction = "";

      // Снятие фокуса с активного элемента
      document.activeElement.blur();
    }

    /**
     * Привязывает обработчики событий к документу (однократно)
     * @returns {void}
     */
    bindEvents() {
      // Проверяем, что события ещё не навешивались
      if (window.__formsValidationEventsBound) return;
      window.__formsValidationEventsBound = true;

      // События focus и blur нужны для показа/очистки ошибок
      document.addEventListener("focus", (e) => this.onFocus(e), true);
      document.addEventListener("blur", (e) => this.onBlur(e), true);
      // Событие change для валидации чекбоксов
      document.addEventListener("change", (e) => this.onChange(e));
      // Событие submit для кастомной обработки отправки формы
      document.addEventListener("submit", (e) => this.onSubmit(e));
    }
  }

  // === Инициализация кастомной валидации (только один раз) ===
  new FormsValidation();

  // === Сохранение данных формы в localStorage при вводе ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    const handleSave = ({ target }) => {
      const { name, type, value, checked } = target;
      if (!name) return;

      let currentData = FormStorage.load(form);

      if (type === "checkbox") {
        currentData[name] = checked;
      } else {
        const cleanedValue = value.replace(/\n{2,}/g, "\n").trim();
        if (cleanedValue) {
          currentData[name] = cleanedValue;
        } else {
          delete currentData[name];
        }
      }

      FormStorage.save(form, currentData);
    };

    form.addEventListener("input", handleSave);
    form.addEventListener("change", handleSave);
  });

  // === Восстановление данных из localStorage при загрузке ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    const formData = FormStorage.load(form);
    for (let key in formData) {
      const el = form.elements[key];
      if (!el) continue;
      if (el.type === "checkbox") {
        el.checked = formData[key];
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        el.value = formData[key];
      }
    }
  });

  /**
   * Инициализирует маску телефона и прогресс-бар для указанного поля
   * @param {HTMLInputElement} phoneInput
   */
  function initPhoneProgressBar(phoneInput) {
    if (typeof IMask !== "undefined") {
      // Применяем маску для телефона
      IMask(phoneInput, {
        mask: "+{38} (000) 000-00-00",
      });
    }

    // Находим прогресс-бар только для текущего поля
    const progressLine = phoneInput
      .closest("form")
      ?.querySelector(".progress-line");

    // Обновляем прогресс-бар при вводе
    phoneInput.addEventListener("input", function () {
      const length = this.value.length;
      const w = this.offsetWidth;
      if (progressLine) {
        progressLine.style.width = (w / 19) * length + "px";
        progressLine.style.backgroundColor = `rgb(${
          255 - (255 / 19) * length
        },137,0)`;
      }
    });

    // Скрываем прогресс-бар при потере фокуса
    phoneInput.addEventListener("blur", () => {
      if (progressLine) progressLine.style.display = "none";
    });

    // Показываем прогресс-бар при фокусе
    phoneInput.addEventListener("focus", () => {
      if (progressLine) progressLine.style.display = "block";
    });
  }

  // === Маска телефона и прогресс-бар для всех телефонных полей ===
  document.querySelectorAll("[data-js-phone]").forEach(initPhoneProgressBar);

  /**
   * Блокирует или разблокирует кнопку отправки формы в зависимости от состояния чекбокса политики
   * @param {HTMLFormElement} form
   */
  function bindPolicyCheckbox(form) {
    const policyCheckbox = form.querySelector(".js-policy-checkbox");
    const btnSubmit = form.querySelector("[data-js-submit]");
    if (!policyCheckbox || !btnSubmit) return;

    // Устанавливаем начальное состояние кнопки
    btnSubmit.disabled = !policyCheckbox.checked;

    // Обработчик изменения состояния чекбокса
    policyCheckbox.addEventListener("change", (e) => {
      btnSubmit.disabled = !e.currentTarget.checked;
    });
  }

  // === Блокировка кнопки отправки, если политика не принята (для каждой формы) ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    bindPolicyCheckbox(form);
  });
});
