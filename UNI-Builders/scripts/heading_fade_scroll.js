document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.5, // Adjust how much of the element must be visible
    }
  );

  const targets = document.querySelectorAll(".scroll-fade");
  targets.forEach((el) => observer.observe(el));
});
