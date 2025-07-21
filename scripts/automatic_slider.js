document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const indicatorsContainer = document.getElementById("indicators");
  const heading = document.getElementById("sliderHeading");
  const wrapper = document.getElementById("sliderWrapper");
  let currentSlide = 0;
  let slideInterval;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.dataset.index = index;
    indicatorsContainer.appendChild(dot);
  });

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    document.querySelectorAll("#indicators span").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    heading.textContent = slides[index].dataset.heading;
    currentSlide = index;
  }

  function startSlider() {
    slideInterval = setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, 5000);
  }

  document.getElementById("prevBtn").addEventListener("click", () => {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  });

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  wrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }
    if (touchEndX > touchStartX + threshold) {
      let prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }
  });

  showSlide(0);
  startSlider();
});
