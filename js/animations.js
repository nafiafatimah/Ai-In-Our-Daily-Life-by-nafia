(() => {
  const field = document.getElementById("particleField");
  const count = window.innerWidth < 650 ? 22 : 42;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * -10}s`;
    dot.style.animationDuration = `${7 + Math.random() * 8}s`;
    dot.style.opacity = `${.12 + Math.random() * .35}`;
    field.appendChild(dot);
  }
  window.addEventListener("slidechange", e => {
    document.body.dataset.activeSlide = e.detail.index;
  });
})();
