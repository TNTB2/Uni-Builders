document.addEventListener("DOMContentLoaded", () => {
  // Select all carousel containers
  const carousels = document.querySelectorAll(".Carousel_slider");

  carousels.forEach((carousel) => {
    const wrapper = carousel.querySelector(".Carousel_slider-wrapper");
    const track = wrapper.querySelector("[class$='_slider-track']");
    const slides = Array.from(track.children);
    const prevBtn = wrapper.querySelector(".prev");
    const nextBtn = wrapper.querySelector(".next");

    let slideStep = 0;
    let isAnimating = false;

    // Calculate slide width + gap dynamically
    function updateSlideStep() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 0;
      slideStep = slideWidth + gap;
    }

    updateSlideStep();

    // Slide function (moves track left by slideStep)
    function slide() {
      if (isAnimating) return;
      isAnimating = true;

      // Clone first slide and append at the end
      const clone = slides[0].cloneNode(true);
      track.appendChild(clone);

      // Animate transform
      track.style.transition = "transform 0.6s ease-in-out";
      track.style.transform = `translateX(-${slideStep}px)`;

      setTimeout(() => {
        // Remove transition and reset position
        track.style.transition = "none";
        track.style.transform = "translateX(0)";

        // Remove original first slide and update slides array
        track.removeChild(slides[0]);
        slides.shift();
        slides.push(clone);

        isAnimating = false;
      }, 600);
    }

    // Manual navigation handlers
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;

        // Clone last slide and prepend
        const clone = slides[slides.length - 1].cloneNode(true);
        track.insertBefore(clone, slides[0]);

        // Immediately shift track left by -slideStep without transition
        track.style.transition = "none";
        track.style.transform = `translateX(-${slideStep}px)`;

        // Force reflow to apply transform before animating back
        void track.offsetWidth;

        // Animate track back to 0
        track.style.transition = "transform 0.6s ease-in-out";
        track.style.transform = "translateX(0)";

        setTimeout(() => {
          // Remove last slide clone (original last slide is still at end)
          track.removeChild(slides[slides.length - 1]);
          slides.pop();
          slides.unshift(clone);

          isAnimating = false;
        }, 600);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        slide();
      });
    }

    // Automatic slide every 3 seconds
    let autoSlideInterval = setInterval(slide, 3000);

    // Update slideStep on window resize
    window.addEventListener("resize", () => {
      updateSlideStep();
    });

    // Optional: pause auto slide on mouse hover
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });
    carousel.addEventListener("mouseleave", () => {
      autoSlideInterval = setInterval(slide, 3000);
    });
  });
});
