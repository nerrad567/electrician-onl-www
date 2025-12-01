(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Smooth scroll for internal nav links (if browser supports it)
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (evt) => {
      // If this nav item is also an overlay trigger, let the overlay logic handle it
      if (link.hasAttribute("data-overlay-target")) {
        evt.preventDefault();
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      evt.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Theme toggle (light / dark)
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeLabel = themeToggleBtn
    ? themeToggleBtn.querySelector(".theme-toggle-label")
    : null;
  const themeIcon = themeToggleBtn
    ? themeToggleBtn.querySelector(".theme-toggle-icon")
    : null;

  function applyTheme(theme) {
    const normalized = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", normalized);
    localStorage.setItem("theme", normalized);
    if (themeLabel && themeIcon) {
      if (normalized === "light") {
        themeLabel.textContent = "Light mode";
        themeIcon.textContent = "☀️";
      } else {
        themeLabel.textContent = "Dark mode";
        themeIcon.textContent = "🌙";
      }
    }
  }

  // Initial theme from localStorage or default (data-theme on <html>)
  (function initTheme() {
    const stored = localStorage.getItem("theme");
    const currentAttr = root.getAttribute("data-theme");
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
    } else if (currentAttr === "light" || currentAttr === "dark") {
      applyTheme(currentAttr);
    } else {
      applyTheme("dark");
    }
  })();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current =
        root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
    });
  }

  // Overlay / modal handling for detailed project views
  const overlayTriggers = document.querySelectorAll("[data-overlay-target]");
  const overlays = document.querySelectorAll(".overlay");

  function openOverlay(overlay) {
    overlay.classList.add("overlay--open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Start Vimeo playback if present
    setOverlayVideoState(overlay, "play");
  }

  function closeOverlay(overlay) {
    // Pause Vimeo playback if present
    setOverlayVideoState(overlay, "pause");

    overlay.classList.remove("overlay--open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function setOverlayVideoState(overlay, action) {
    // action: "play" or "pause"
    const iframe = overlay.querySelector(".overlay-video");
    if (!iframe || !iframe.contentWindow) return;

    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: action }),
        "https://player.vimeo.com"
      );
    } catch (e) {
      // ignore if player not ready yet
    }
  }

  overlayTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetSelector = trigger.getAttribute("data-overlay-target");
      if (!targetSelector) return;
      const overlay = document.querySelector(targetSelector);
      if (!overlay) return;
      openOverlay(overlay);
    });
  });

  document.addEventListener("click", (evt) => {
    const closeTrigger = evt.target.closest("[data-overlay-close]");
    if (!closeTrigger) return;
    const overlay = closeTrigger.closest(".overlay");
    if (!overlay) return;
    closeOverlay(overlay);
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key !== "Escape") return;
    overlays.forEach((overlay) => {
      if (overlay.classList.contains("overlay--open")) {
        closeOverlay(overlay);
      }
    });
  });
})();
