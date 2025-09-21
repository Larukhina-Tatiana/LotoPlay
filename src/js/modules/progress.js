// const circles = document.querySelectorAll(".facts-element__circle");
// circles.forEach((el) => {
//   if (el.dataset.percentage == "true") {
//     let progress = el.querySelector(".progress");
//     let valueBlock = el.querySelector(".facts-element__value");
//     let radius = progress.getAttribute("r");
//     let circleLength = 2 * Math.PI * radius;
//     let full = el.dataset.full;
//     let value = el.dataset.value;
//     let percentageProgress = Math.floor((value / full) * 100);
//     valueBlock.textContent = value;
//     progress.setAttribute("stroke-dasharray", circleLength);
//     progress.setAttribute(
//       "stroke-dashoffset",
//       circleLength - (circleLength * percentageProgress) / 100
//     );
//   } else {
//     let progress = el.querySelector(".progress");
//     let valueBlock = el.querySelector(".facts-element__value");
//     let radius = progress.getAttribute("r");
//     let circleLength = 2 * Math.PI * radius;
//     let percent = el.dataset.percent;
//     let percentageProgress = Math.floor(percent);
//     valueBlock.textContent = percent + "%";
//     progress.setAttribute("stroke-dasharray", circleLength);
//     progress.setAttribute(
//       "stroke-dashoffset",
//       circleLength - (circleLength * percentageProgress) / 100
//     );
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const circles = document.querySelectorAll(".facts-element__circle");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const circleElement = entry.target;
          const progress = circleElement.querySelector(".progress");
          const valueBlock = circleElement.querySelector(
            ".facts-element__value"
          );
          const radius = progress.getAttribute("r");
          const circleLength = 2 * Math.PI * radius;

          if (circleElement.dataset.percentage === "true") {
            const full = parseFloat(circleElement.dataset.full);
            const value = parseFloat(circleElement.dataset.value);
            const percentageProgress = Math.floor((value / full) * 100);

            valueBlock.textContent = value;
            progress.setAttribute("stroke-dasharray", circleLength);

            setTimeout(() => {
              progress.style.strokeDashoffset =
                circleLength - (circleLength * percentageProgress) / 100;
            }, 10);
          } else {
            const percent = parseFloat(circleElement.dataset.percent);
            const percentageProgress = Math.floor(percent);

            valueBlock.textContent = percent + "%";
            progress.setAttribute("stroke-dasharray", circleLength);

            setTimeout(() => {
              progress.style.strokeDashoffset =
                circleLength - (circleLength * percentageProgress) / 100;
            }, 10);
          }

          // Добавляем класс для запуска анимации значения
          setTimeout(() => {
            valueBlock.classList.add("show");
          }, 1000);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  circles.forEach((circle) => {
    observer.observe(circle);
  });
});
