document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".collaborators_slider-track");
  let slides = Array.from(track.children);
  let slideStep = getSlideStep();
  let isAnimating = false;

  function getSlidesPerView() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 3 : 5;
  }

  function getSlideStep() {
    const slide = slides[0];
    const rect = slide.getBoundingClientRect();
    const style = window.getComputedStyle(slide);
    const marginRight = parseFloat(style.marginRight || 0);
    return rect.width + marginRight;
  }

  function slide() {
    if (isAnimating) return;
    isAnimating = true;

    // Clone first slide and append it
    const clone = slides[0].cloneNode(true);
    track.appendChild(clone);

    // Animate to next position
    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform = `translateX(-${slideStep}px)`;

    // After animation completes
    setTimeout(() => {
      // Reset instantly
      track.style.transition = "none";
      track.style.transform = "translateX(0)";

      // Remove original first slide
      track.removeChild(slides[0]);

      // Update internal slide list
      slides.shift();
      slides.push(clone);

      isAnimating = false;
    }, 600); // match CSS transition duration
  }

  // Initial step size
  let slidesPerView = getSlidesPerView();

  setInterval(slide, 3000);

  window.addEventListener("resize", () => {
    slideStep = getSlideStep();
    slidesPerView = getSlidesPerView();
  });
});
