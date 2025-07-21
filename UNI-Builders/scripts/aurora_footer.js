document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".site-footer");

  // Colours for aurora effect
  const colours = [
    "rgba(0,255,255,0.6)",
    "rgba(255,0,255,0.5)",
    "rgba(0,255,100,0.4)",
    "rgba(0,150,255,0.4)",
    "rgba(255,255,0,0.4)",
  ];

  // Generate a random gradient with color stops at random positions
  function generateGlowGradient() {
    let stops = [];
    for (let i = 0; i < 8; i++) {
      const colour = colours[Math.floor(Math.random() * colours.length)];
      const pos = Math.floor(Math.random() * 100);
      stops.push(`${colour} ${pos}%`);
    }
    return `linear-gradient(90deg, ${stops.join(", ")})`;
  }

  // Create aurora element or reuse if exists
  let auroraLine = document.querySelector(".aurora-border");
  if (!auroraLine) {
    auroraLine = document.createElement("div");
    auroraLine.className = "aurora-border";
    footer.appendChild(auroraLine);
  }

  // Set initial gradient background
  auroraLine.style.background = generateGlowGradient();

  // Update the aurora gradient periodically with smooth transition
  setInterval(() => {
    auroraLine.style.background = generateGlowGradient();
  }, 10000);

  // Function to update background-position based on cursor X or scroll
  function updateBackgroundPosition(xPercent) {
    // Map xPercent (0-100) to background-position X (0% to 200%)
    // Wider than 100% because background-size: 300% for smooth flow
    const posX = 200 * (xPercent / 100);
    auroraLine.style.backgroundPosition = `${posX}% 50%`;
  }

  // Track mouse movement
  window.addEventListener("mousemove", (e) => {
    const xPercent = (e.clientX / window.innerWidth) * 100;
    updateBackgroundPosition(xPercent);
  });

  // Optional: Track horizontal scroll (if any)
  window.addEventListener("scroll", () => {
    const scrollX = window.scrollX || window.pageXOffset;
    const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
    if (maxScrollX > 0) {
      const scrollPercent = (scrollX / maxScrollX) * 100;
      updateBackgroundPosition(scrollPercent);
    }
  });
});
