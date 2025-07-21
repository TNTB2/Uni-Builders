document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".collaborators_slider-track");
  const allSlides = Array.from(track.children);
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 3 : 5;
  }

  function updateVisibleSlides() {
    allSlides.forEach(slide => slide.style.display = "none");
    for (let i = 0; i < slidesPerView; i++) {
      if (allSlides[i]) {
        allSlides[i].style.display = "flex";
      }
    }
  }

  function slide() {
    // Animate left
    track.classList.add("slide-transition");

    setTimeout(() => {
      // Move first to end
      const first = allSlides.shift();
      track.appendChild(first);
      allSlides.push(first);

      // Reset visible slides
      updateVisibleSlides();

      // Animate back right
      track.classList.remove("slide-transition");
      track.classList.add("slide-reset");

      // Clean up reset class after animation
      setTimeout(() => {
        track.classList.remove("slide-reset");
      }, 500);
    }, 500); // Match duration of slideLeft
  }

  updateVisibleSlides();
  const interval = setInterval(slide, 3000);

  window.addEventListener("resize", () => {
    slidesPerView = getSlidesPerView();
    updateVisibleSlides();
  });
});
