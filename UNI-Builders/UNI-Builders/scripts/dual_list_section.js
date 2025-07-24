document.addEventListener("DOMContentLoaded", () => {
  const columns = document.querySelectorAll(".list_column");
  const dualListSection = document.querySelector(".dual_list_section");

  const visibleWindow = 5;
  const halfWindow = Math.floor(visibleWindow / 2);
  const minOpacity = 0.3;
  const opacityRange = 1 - minOpacity;
  const verticalShiftRatio = 0.25;

  const autoProgress = Array(columns.length).fill(0);
  const manualProgress = Array(columns.length).fill(null);
  const isHovering = Array(columns.length).fill(false);

  // Helper
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Pad all lists to match longest
  const maxLength = Math.max(
    ...Array.from(columns).map((col) => col.querySelectorAll("li").length)
  );
  columns.forEach((col) => {
    const ul = col.querySelector(".scrolling_list");
    const items = ul.querySelectorAll("li");
    const missing = maxLength - items.length;
    for (let i = 0; i < missing; i++) {
      const emptyLi = document.createElement("li");
      emptyLi.textContent = "";
      ul.appendChild(emptyLi);
    }
  });

  // Main update function
  function updateColumn(colIndex, progress) {
    const col = columns[colIndex];
    const ul = col.querySelector(".scrolling_list");
    const items = ul.querySelectorAll("li");
    const itemsCount = items.length;

    const centerIndex = Math.round(progress * (itemsCount - 1));
    const itemHeight = items[0].offsetHeight;
    const containerHeight = col.clientHeight;
    const verticalShift = containerHeight * verticalShiftRatio;

    const offset =
      containerHeight / 2 -
      itemHeight / 2 -
      centerIndex * itemHeight -
      verticalShift;

    ul.style.transform = `translateY(${offset}px)`;

    items.forEach((item, index) => {
      const distance = Math.abs(index - centerIndex);
      if (distance > halfWindow) {
        item.style.opacity = "0";
        item.style.pointerEvents = "none";
      } else {
        const opacity = 1 - (distance / halfWindow) * opacityRange;
        item.style.opacity = opacity.toFixed(2);
        item.style.pointerEvents = "auto";
      }
    });
  }

  // Update all lists (auto-scroll)
  function updateLists() {
    const rect = dualListSection.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const startOffset = 100;
    const endOffset = 100;

    let progress;
    if (rect.bottom <= 0 + endOffset) {
      progress = 1;
    } else if (rect.top >= viewportHeight - startOffset) {
      progress = 0;
    } else {
      const start = viewportHeight + startOffset;
      const end = 0 - endOffset;
      const clamped = clamp(rect.bottom, end, start);
      progress = (start - clamped) / (start - end);
      progress = clamp(progress, 0, 1);
    }

    columns.forEach((_, i) => {
      if (!isHovering[i]) {
        autoProgress[i] = progress;
        updateColumn(i, autoProgress[i]);
      }
    });

    ticking = false;
  }

  // Scroll tick
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateLists);
      ticking = true;
    }
  }

  // Hover + Touch support per list
  function attachHoverHandlers(colIndex) {
    const col = columns[colIndex];
    let currentProgress = autoProgress[colIndex];
    manualProgress[colIndex] = currentProgress;

    let lastTouchY = null;

    function onMouseEnter() {
      if (isTouchDevice()) return;
      isHovering[colIndex] = true;
    }

    function onMouseLeave() {
      if (isTouchDevice()) return;
      isHovering[colIndex] = false;
      autoProgress[colIndex] =
        manualProgress[colIndex] ?? autoProgress[colIndex];
      manualProgress[colIndex] = null;
    }

    function onWheel(e) {
      if (isTouchDevice()) return;
      e.preventDefault();
      const delta = e.deltaY;
      const sensitivity = 0.0015;
      currentProgress = clamp(
        currentProgress + delta * sensitivity,
        0,
        1
      );
      manualProgress[colIndex] = currentProgress;
      updateColumn(colIndex, currentProgress);
    }

    function onTouchStart(e) {
      if (e.touches.length === 1) {
        lastTouchY = e.touches[0].clientY;
        isHovering[colIndex] = true;
      }
    }

    function onTouchMove(e) {
      if (e.touches.length === 1 && lastTouchY !== null) {
        const touchY = e.touches[0].clientY;
        const delta = lastTouchY - touchY;
        lastTouchY = touchY;
        const sensitivity = 0.002;
        currentProgress = clamp(
          currentProgress + delta * sensitivity,
          0,
          1
        );
        manualProgress[colIndex] = currentProgress;
        updateColumn(colIndex, currentProgress);
        e.preventDefault();
      }
    }

    function onTouchEnd() {
      isHovering[colIndex] = false;
      autoProgress[colIndex] =
        manualProgress[colIndex] ?? autoProgress[colIndex];
      manualProgress[colIndex] = null;
      lastTouchY = null;
    }

    col.addEventListener("mouseenter", onMouseEnter);
    col.addEventListener("mouseleave", onMouseLeave);
    col.addEventListener("wheel", onWheel, { passive: false });

    if (isTouchDevice()) {
      col.addEventListener("touchstart", onTouchStart, { passive: false });
      col.addEventListener("touchmove", onTouchMove, { passive: false });
      col.addEventListener("touchend", onTouchEnd, { passive: false });
    }
  }

  // Initialise all handlers
  columns.forEach((_, i) => attachHoverHandlers(i));

  // First draw
  updateLists();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
