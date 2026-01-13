document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonial-grid");
  if (!track) return;

  const originals = Array.from(track.children);
  if (originals.length === 0) return;

  const prependClones = originals.map(n => n.cloneNode(true));
  const appendClones  = originals.map(n => n.cloneNode(true));

  prependClones.slice().reverse().forEach(n => track.insertBefore(n, track.firstChild));
  appendClones.forEach(n => track.appendChild(n));

  const getSetWidth = () => {
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;

    const all = Array.from(track.children);
    const start = originals.length;
    const middleSet = all.slice(start, start + originals.length);

    const cardsWidth = middleSet.reduce((sum, el) => sum + el.offsetWidth, 0);
    const gapsWidth = gap * (middleSet.length - 1);
    return cardsWidth + gapsWidth;
  };

  const jumpToMiddle = () => {
    const setWidth = getSetWidth();
    track.scrollLeft = setWidth;
  };

  requestAnimationFrame(() => {
    jumpToMiddle();
  });

  track.addEventListener("scroll", () => {
    const setWidth = getSetWidth();

    if (track.scrollLeft < setWidth * 0.5) {
      track.scrollLeft += setWidth;
    }

    if (track.scrollLeft > setWidth * 1.5) {
      track.scrollLeft -= setWidth;
    }
  });

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener("pointerdown", (e) => {
    isDown = true;
    track.classList.add("dragging");
    track.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.clientX - startX;
    track.scrollLeft = startScrollLeft - dx;
  });

  const endDrag = () => {
    isDown = false;
    track.classList.remove("dragging");
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", endDrag);

  window.addEventListener("resize", () => {
    jumpToMiddle();
  });
});
