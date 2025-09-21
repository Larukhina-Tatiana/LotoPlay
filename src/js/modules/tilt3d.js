class Tilt3D {
  constructor(containerElement, innerElement) {
    this.container = containerElement;
    this.inner = innerElement;
    this.mouse = { _x: 0, _y: 0, x: 0, y: 0 };
    this.sensitivity = 0.5; // по умолчанию
    this.counter = 0;
    this.updateRate = 10;
    this.boundUpdate = this.update.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
  }

  setOrigin() {
    const rect = this.container.getBoundingClientRect();
    this.mouse._x = rect.left + rect.width / 2;
    this.mouse._y = rect.top + rect.height / 2;
  }

  updatePosition(event) {
    this.mouse.x = event.clientX - this.mouse._x;
    this.mouse.y = (event.clientY - this.mouse._y) * -1;
  }

  update(event) {
    this.updatePosition(event);

    const height = this.inner.offsetHeight || 1;
    const width = this.inner.offsetWidth || 1;

    const x = ((this.mouse.y / height) * this.sensitivity).toFixed(2);
    const y = ((this.mouse.x / width) * this.sensitivity).toFixed(2);

    this.inner.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }

  onMouseMove(event) {
    if (this.counter++ % this.updateRate === 0) {
      this.boundUpdate(event);
    }
  }

  init() {
    if (!this.container || !this.inner) return;

    this.setOrigin();

    this.container.addEventListener("mousemove", this.boundMouseMove);
    this.container.addEventListener("mouseleave", () => {
      this.inner.style.transform = "none";
    });

    // Опционально: transition и will-change
    this.inner.style.transition = "transform 0.1s ease-out";
    this.inner.style.willChange = "transform";
  }

  destroy() {
    this.container.removeEventListener("mousemove", this.boundMouseMove);
    this.inner.style.transform = "none";
    this.inner.style.transition = "";
    this.inner.style.willChange = "";
  }

  setSensitivity(value) {
    this.sensitivity = parseFloat(value) || 0.5;
  }
}
export default Tilt3D;
