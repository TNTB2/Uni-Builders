document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const target = entry.target;
                if (entry.isIntersecting) {
                    target.classList.add("visible");
                } else {
                    target.classList.remove("visible");
                }
            });
        },
        {
            threshold: 0.4,
        }
    );

    const slideItems = document.querySelectorAll(
        ".grid-item.slide-in-left, .grid-item.slide-in-right"
    );
    slideItems.forEach((item) => observer.observe(item));
});