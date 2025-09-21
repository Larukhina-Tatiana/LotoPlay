// Класс FormStorage — управляет сохранением, загрузкой и удалением данных формы в localStorage
class FormStorage {
  /**
   * Генерирует уникальный ключ для хранения данных формы
   * Использует атрибут name, id или "default", если ничего не задано
   * @param {HTMLFormElement} form
   * @returns {string}
   */
  static getKey(form) {
    return (
      "form-storage:" + (form.getAttribute("name") || form.id || "default")
    );
  }

  /**
   * Загружает сохранённые данные формы из localStorage
   * @param {HTMLFormElement} form
   * @returns {Object} — объект с сохранёнными значениями или пустой объект
   */
  static load(form) {
    const key = this.getKey(form);
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Ошибка чтения из localStorage:", error);
      return {};
    }
  }

  /**
   * Сохраняет данные формы в localStorage
   * Если объект пустой — удаляет запись
   * @param {HTMLFormElement} form
   * @param {Object} data — ключ-значение полей формы
   */
  static save(form, data) {
    const key = this.getKey(form);
    try {
      if (Object.keys(data).length === 0) {
        // Если нет данных — удаляем запись
        localStorage.removeItem(key);
      } else {
        // Сохраняем сериализованные данные
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Ошибка записи в localStorage:", error);
    }
  }

  /**
   * Удаляет сохранённые данные формы из localStorage
   * @param {HTMLFormElement} form
   */
  static remove(form) {
    const key = this.getKey(form);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Ошибка удаления из localStorage:", error);
    }
  }
}

// Экспорт класса для использования в других модулях
export default FormStorage;
