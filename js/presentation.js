(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const notes = [
    `Good morning, everyone!\n\nHow are you today?\n\nBefore I start, I want to ask you something.\n\nHave you ever opened TikTok just to watch one video, but then spent one hour scrolling?\n\nI think many of us have experienced that!\n\nWell, AI is one of the reasons.`,
    `Pause and look around the room. Give the audience a moment to think or smile.\n\nThis is a relatable example that helps connect the topic to everyday life.`,
    `First, what is AI?\n\nAI stands for Artificial Intelligence. It is a technology that helps computers do tasks that usually need human intelligence. For example, AI can learn from information, answer questions, and find patterns.`,
    `Second, where can we find AI?\n\nActually, AI is already part of our daily lives.\n\nFor example, TikTok recommends videos that we may like. Google Maps helps us find the best route. Online shopping apps also suggest products based on our interests.\n\nSo, sometimes we use AI without even realizing it!`,
    `Now, how do I use AI?\n\nAs an IT graduate, I often use AI to help me learn programming, create websites, understand data, and summarize long documents.\n\nAI helps me save time and learn new things. When I don't understand something, I can ask AI to explain it in a simple way.\n\nFor me, AI is like a personal assistant.`,
    `But, is AI always good?\n\nOf course, not!\n\nAI can sometimes give wrong information. Also, if we use AI too much, we may become lazy to think and solve problems by ourselves.\n\nThat's why we should not believe everything AI says. We need to check the information and use our own knowledge.`,
    `What about the future?\n\nI am interested in learning more about AI Agents.\n\nAn AI Agent is a system that can help us do tasks automatically. For example, it can organize information, analyze data, and even help us track our daily expenses.\n\nI think this technology will make our daily activities easier.`,
    `Finally, I want to say:\n\nAI is a useful tool, but it cannot replace our own thinking.\n\nWe should learn about AI, use it wisely, and keep improving our own skills.\n\nAnd remember...\n\nDon't let AI do all your thinking!\n\nThank you for listening!`
  ];
  const titles = slides.map(s => s.dataset.title);
  let current = 0;
  const $ = id => document.getElementById(id);

  function renderNotes() {
    $("notesSlideTitle").textContent = `${String(current + 1).padStart(2, "0")} / 08 — ${titles[current]}`;
    $("notesContent").textContent = notes[current];
  }
  function showSlide(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    $("currentNumber").textContent = String(current + 1).padStart(2, "0");
    $("footerSlide").textContent = `${String(current + 1).padStart(2, "0")} / 08`;
    $("progressFill").style.width = `${((current + 1) / slides.length) * 100}%`;
    $("prevButton").disabled = current === 0;
    $("prevButton").style.opacity = current === 0 ? ".35" : "1";
    $("nextButton").innerHTML = current === slides.length - 1 ? "↻" : "→";
    $("nextButton").setAttribute("aria-label", current === slides.length - 1 ? "Replay presentation" : "Next slide");
    renderNotes();
    document.querySelectorAll(".overview-item").forEach((el, i) => el.classList.toggle("current", i === current));
    window.dispatchEvent(new CustomEvent("slidechange", { detail: { index: current } }));
  }
  function next() { if (current === slides.length - 1) showSlide(0); else showSlide(current + 1); }
  function previous() { showSlide(current - 1); }
  function openNotes(force) {
    const panel = $("speakerNotes");
    const shouldOpen = typeof force === "boolean" ? force : !panel.classList.contains("open");
    panel.classList.toggle("open", shouldOpen);
    $("notesButton").classList.toggle("active", shouldOpen);
  }
  function openOverview(force) {
    const panel = $("overviewOverlay");
    panel.classList.toggle("open", typeof force === "boolean" ? force : !panel.classList.contains("open"));
  }
  function buildOverview() {
    $("overviewGrid").innerHTML = "";
    titles.forEach((title, i) => {
      const button = document.createElement("button");
      button.className = "overview-item";
      button.innerHTML = `<span>SLIDE ${String(i + 1).padStart(2, "0")}</span><strong>${title}</strong>`;
      button.addEventListener("click", () => { showSlide(i); openOverview(false); });
      $("overviewGrid").appendChild(button);
    });
  }
  $("prevButton").addEventListener("click", previous);
  $("nextButton").addEventListener("click", next);
  $("notesButton").addEventListener("click", () => openNotes());
  $("closeNotes").addEventListener("click", () => openNotes(false));
  $("overviewButton").addEventListener("click", () => openOverview());
  $("closeOverview").addEventListener("click", () => openOverview(false));
  $("restartButton").addEventListener("click", () => showSlide(0));
  $("fullscreenButton").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (e) { console.warn("Fullscreen is not available in this browser.", e); }
  });
  document.addEventListener("keydown", e => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); previous(); }
    if (e.key.toLowerCase() === "n") openNotes();
    if (e.key.toLowerCase() === "f") $("fullscreenButton").click();
    if (e.key === "Escape") { openNotes(false); openOverview(false); }
  });
  let touchStartX = 0;
  $("presentationScreen").addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  $("presentationScreen").addEventListener("touchend", e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 65 && window.innerWidth < 700) dx < 0 ? next() : previous();
  }, { passive: true });
  buildOverview();
  showSlide(0);
  window.Presentation = { showSlide, next, previous, openNotes, getCurrent: () => current };
})();
