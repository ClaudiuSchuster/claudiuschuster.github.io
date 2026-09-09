(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const languageToggle = document.querySelector(".language-toggle");
  const themeColor = document.querySelector("#theme-color");
  const storageKey = "claudiuschuster.github.io:theme";
  const themes = ["atelier", "prismatic"];
  const languages = ["de", "en"];

  const readStoredTheme = () => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return themes.includes(stored) ? stored : null;
    } catch (_error) {
      return null;
    }
  };

  const storeTheme = theme => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (_error) {
      // Private browsing and strict storage settings should not break the page.
    }
  };

  const currentLanguage = () => languages.includes(root.dataset.language) ? root.dataset.language : "de";

  const updateThemeControls = () => {
    if (!themeToggle) return;
    const theme = root.dataset.theme === "prismatic" ? "prismatic" : "atelier";
    const language = currentLanguage();
    const label = themeToggle.getAttribute(`data-label-${language}-${theme}`);
    themeToggle.setAttribute("aria-checked", String(theme === "prismatic"));
    if (label) themeToggle.setAttribute("aria-label", label);
    if (themeColor) themeColor.setAttribute("content", theme === "prismatic" ? "#f3efe6" : "#090711");
  };

  const setTheme = (theme, persist = true) => {
    const nextTheme = themes.includes(theme) ? theme : "atelier";
    root.dataset.theme = nextTheme;
    updateThemeControls();
    if (persist) storeTheme(nextTheme);
  };

  const updateLanguageControls = () => {
    const language = currentLanguage();
    root.lang = language;
    document.querySelectorAll("[data-label-de][data-label-en]").forEach(element => {
      const label = element.getAttribute(`data-label-${language}`);
      if (label) element.setAttribute("aria-label", label);
    });
    if (languageToggle) {
      const label = languageToggle.getAttribute(`data-label-${language}`);
      if (label) languageToggle.setAttribute("aria-label", label);
    }
    updateThemeControls();
    document.title = language === "en"
      ? "Claudiu Schuster — A small constellation"
      : "Claudiu Schuster — Eine kleine Konstellation";
  };

  setTheme(readStoredTheme() || root.dataset.theme, false);
  updateLanguageControls();

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "prismatic" ? "atelier" : "prismatic");
  });

  languageToggle?.addEventListener("click", () => {
    root.dataset.language = currentLanguage() === "de" ? "en" : "de";
    updateLanguageControls();
  });

  const field = document.querySelector("[data-signal-field]");
  if (!field || !window.matchMedia || !window.requestAnimationFrame) return;

  const paths = [field.querySelector(".signal-path-cyan"), field.querySelector(".signal-path-violet")].filter(Boolean);
  const packets = [...field.querySelectorAll(".signal-packets circle")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (paths.length !== 2 || packets.length === 0) return;

  const lengths = paths.map(path => path.getTotalLength());
  let inView = false;
  let pageActive = true;
  let animationFrame = 0;
  let lastTimestamp = 0;
  let elapsed = 0;

  const shouldRun = () => inView && pageActive && !document.hidden && !reducedMotion.matches;

  const renderPackets = () => {
    packets.forEach((packet, index) => {
      const pathIndex = Number(packet.dataset.path) || 0;
      const phase = Number(packet.dataset.phase) || 0;
      const speed = Number(packet.dataset.speed) || 0;
      const progress = ((phase + elapsed * speed) % 1 + 1) % 1;
      const point = paths[pathIndex].getPointAtLength(progress * lengths[pathIndex]);
      packet.setAttribute("cx", point.x.toFixed(2));
      packet.setAttribute("cy", point.y.toFixed(2));
      packet.setAttribute("opacity", reducedMotion.matches ? ".55" : String(.32 + .68 * Math.sin(progress * Math.PI)));
      packet.dataset.index = String(index);
    });
  };

  const tick = timestamp => {
    animationFrame = 0;
    if (!shouldRun()) {
      lastTimestamp = 0;
      renderPackets();
      return;
    }
    if (lastTimestamp) elapsed += Math.min((timestamp - lastTimestamp) / 1000, .05);
    lastTimestamp = timestamp;
    renderPackets();
    animationFrame = window.requestAnimationFrame(tick);
  };

  const syncMotion = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastTimestamp = 0;
    renderPackets();
    if (shouldRun()) animationFrame = window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === field);
      if (entry) inView = entry.isIntersecting && entry.intersectionRatio > 0;
      syncMotion();
    });
    observer.observe(field);
  } else {
    inView = true;
  }

  const setPointer = (x, y) => {
    const normalizedX = Math.max(-.5, Math.min(.5, x));
    const normalizedY = Math.max(-.5, Math.min(.5, y));
    field.style.setProperty("--pointer-x", `${((normalizedX + .5) * 100).toFixed(2)}%`);
    field.style.setProperty("--pointer-y", `${((normalizedY + .5) * 100).toFixed(2)}%`);
    field.style.setProperty("--pointer-shift-x", `${(normalizedX * 14).toFixed(2)}px`);
    field.style.setProperty("--pointer-shift-y", `${(normalizedY * 14).toFixed(2)}px`);
  };

  field.addEventListener("pointermove", event => {
    const bounds = field.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    setPointer((event.clientX - bounds.left) / bounds.width - .5, (event.clientY - bounds.top) / bounds.height - .5);
  });

  field.addEventListener("pointerleave", () => setPointer(0, 0));
  document.addEventListener("visibilitychange", syncMotion);
  window.addEventListener("pagehide", () => {
    pageActive = false;
    syncMotion();
  });
  window.addEventListener("pageshow", () => {
    pageActive = true;
    syncMotion();
  });

  if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", syncMotion);
  else if (typeof reducedMotion.addListener === "function") reducedMotion.addListener(syncMotion);
  syncMotion();
})();
