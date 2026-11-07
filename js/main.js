(() => {
  const $ = id => document.getElementById(id);
  const welcome = $("welcomeScreen");
  const loading = $("loadingScreen");
  const presentation = $("presentationScreen");
  const start = $("startButton");
  let soundEnabled = true;
  let audioContext = null;
  let started = false;

  function playTone(frequency = 520, duration = .09, type = "sine", volume = .035) {
    if (!soundEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch (error) { console.info("Audio is not available.", error); }
  }
  function transitionTo(target) {
    [welcome, loading, presentation].forEach(s => s.classList.remove("active"));
    target.classList.add("active");
  }
  function beginPresentation() {
    if (started) return;
    started = true;
    transitionTo(loading);
    playTone(420, .15, "sine", .025);
    const progress = $("loaderProgress");
    const percent = $("loadingPercent");
    const text = $("loadingText");
    const messages = ["Waking up the possibilities...", "Connecting everyday moments...", "Almost ready to explore..."];
    let value = 0;
    const interval = setInterval(() => {
      value = Math.min(100, value + 2 + Math.random() * 5);
      progress.style.width = `${value}%`;
      percent.textContent = `${Math.round(value)}%`;
      if (value > 35 && value < 70) text.textContent = messages[1];
      if (value >= 70) text.textContent = messages[2];
      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          transitionTo(presentation);
          playTone(660, .12, "sine", .025);
          setTimeout(() => playTone(880, .16, "sine", .02), 90);
          started = false;
        }, 220);
      }
    }, 65);
  }
  start.addEventListener("click", beginPresentation);
  $("soundButton").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    $("soundButton").classList.toggle("active", soundEnabled);
    $("soundButton").textContent = soundEnabled ? "♫" : "♩";
    $("soundButton").setAttribute("aria-label", soundEnabled ? "Mute sound" : "Enable sound");
    if (soundEnabled) playTone(620, .1);
  });
  window.addEventListener("slidechange", () => playTone(520, .065, "sine", .018));
})();
