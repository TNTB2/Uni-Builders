document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".main-header");
  const gradient = header.querySelector(".gradient-layer");

  let isInteracting = false;
  let animationId;
  let idleX = 0;
  let direction = 1;

  let targetX = 50;
  let targetY = 50;
  let currentX = 50;
  let currentY = 50;

  // Update the radial gradient background
  const updateGradient = () => {
    gradient.style.background = `radial-gradient(circle at ${currentX}% ${currentY}%, #00f2fe, #4facfe, #2a2a72)`;
  };

  // Main animation loop
  const animate = () => {
    if (!isInteracting) {
      // Idle flow back and forth
      idleX += 0.2 * direction;
      if (idleX >= 100 || idleX <= 0) direction *= -1;
      targetX = idleX;
      targetY = 50;
    }

    // Smoothly interpolate toward target
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    updateGradient();
    animationId = requestAnimationFrame(animate);
  };

  // Start animation
  animate();

  const onMove = (x, y) => {
    isInteracting = true;
    const rect = header.getBoundingClientRect();
    targetX = ((x - rect.left) / rect.width) * 100;
    targetY = ((y - rect.top) / rect.height) * 100;
  };

  header.addEventListener("mousemove", (e) => {
    onMove(e.clientX, e.clientY);
  });

  header.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    onMove(touch.clientX, touch.clientY);
  });

  header.addEventListener("mouseleave", () => {
    isInteracting = false;
  });

  header.addEventListener("touchend", () => {
    isInteracting = false;
  });
});
