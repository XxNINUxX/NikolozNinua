/* script.js — Retro 8-bit Portfolio interactions */
(function () {
  "use strict";

  /* -----------------------------------------------------------------------
   * Helpers
   * --------------------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  /* Show a toast message */
  function showToast(msg, duration) {
    duration = duration || 2800;
    var container = $("#toast-container");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, duration + 320);
  }

  /* -----------------------------------------------------------------------
   * Navigation
   * --------------------------------------------------------------------- */
  var ORDER = ["profile", "skills", "projects", "experience", "contact"];
  var currentIndex = 0;

  var navButtons = $$(".nav-btn[data-target]");
  var panels = $$(".panel");
  var indicator = $("#nav-indicator");

  function getNavBtn(id) {
    return navButtons.find(function (b) { return b.getAttribute("data-target") === id; }) || null;
  }

  function updateIndicator(btn) {
    if (!indicator || !btn) return;
    var navTrack = btn.closest(".nav-track") || btn.parentElement;
    var trackRect = navTrack.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    indicator.style.left  = btn.offsetLeft + "px";
    indicator.style.width = btn.offsetWidth + "px";
  }

  function navigateTo(id, fromKey) {
    var idx = ORDER.indexOf(id);
    if (idx === -1) return;
    currentIndex = idx;

    /* Update panels */
    panels.forEach(function (p) {
      var active = p.id === id;
      p.hidden = !active;
      if (active && fromKey) {
        /* Move focus into the panel for keyboard users */
        p.focus();
      }
    });

    /* Update nav buttons */
    navButtons.forEach(function (b) {
      var active = b.getAttribute("data-target") === id;
      b.setAttribute("aria-selected", active ? "true" : "false");
      b.setAttribute("aria-current", active ? "true" : "false");
      b.setAttribute("tabindex", active ? "0" : "-1");
    });

    /* Animate indicator */
    var btn = getNavBtn(id);
    if (btn) updateIndicator(btn);
  }

  /* Initial render */
  navigateTo("profile", false);

  /* Click nav buttons */
  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigateTo(btn.getAttribute("data-target"), false);
    });
    /* Space/Enter activation (redundant for button but explicit for clarity) */
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigateTo(btn.getAttribute("data-target"), false);
      }
      /* Left/right arrow roving tabindex across nav buttons */
      if (e.key === "ArrowRight") {
        e.preventDefault();
        var next = (currentIndex + 1) % ORDER.length;
        navigateTo(ORDER[next], false);
        var nextBtn = getNavBtn(ORDER[next]);
        if (nextBtn) nextBtn.focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        var prev = (currentIndex - 1 + ORDER.length) % ORDER.length;
        navigateTo(ORDER[prev], false);
        var prevBtn = getNavBtn(ORDER[prev]);
        if (prevBtn) prevBtn.focus();
      }
    });
  });

  /* Global arrow keys (when focus is NOT on an input/button) */
  document.addEventListener("keydown", function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      navigateTo(ORDER[(currentIndex + 1) % ORDER.length], true);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      navigateTo(ORDER[(currentIndex - 1 + ORDER.length) % ORDER.length], true);
    }
  });

  /* Re-position indicator on window resize */
  window.addEventListener("resize", function () {
    var btn = getNavBtn(ORDER[currentIndex]);
    if (btn) updateIndicator(btn);
  });

  /* -----------------------------------------------------------------------
   * Copy Email
   * --------------------------------------------------------------------- */
  var copyBtn = $("#copy-email");
  if (copyBtn) {
    var originalEmail = copyBtn.textContent.trim();

    function doReset() {
      copyBtn.textContent = originalEmail;
    }

    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(originalEmail).then(function () {
          copyBtn.textContent = "COPIED! ✓";
          showToast("✉ Email copied to clipboard!");
          setTimeout(doReset, 1800);
        }).catch(function () {
          showToast("✉ " + originalEmail, 4000);
        });
      } else {
        /* Fallback — show in toast */
        showToast("✉ " + originalEmail, 4000);
      }
    });
  }

  /* -----------------------------------------------------------------------
   * Audio (chiptune background music)
   * Feature-detect: try loading the asset; if it 404s, hide UI.
   * --------------------------------------------------------------------- */
  var audioEl      = $("#bg-audio");
  var audioControls = $("#audio-controls");
  var playBtn      = $("#audio-play-pause");
  var volSlider    = $("#audio-volume");

  var AUDIO_SRC    = "assets/chiptune-loop.mp3";
  var LS_PLAYING   = "retro_audio_playing";
  var LS_VOLUME    = "retro_audio_volume";

  var audioReady = false;      /* asset confirmed to exist */
  var userGestured = false;    /* any user interaction occurred */
  var wantPlay  = false;       /* user intent */

  function loadSavedPrefs() {
    var savedVol = localStorage.getItem(LS_VOLUME);
    if (savedVol !== null) {
      var v = parseFloat(savedVol);
      if (!isNaN(v)) {
        audioEl.volume = v;
        if (volSlider) volSlider.value = v;
      }
    }
    wantPlay = localStorage.getItem(LS_PLAYING) === "true";
  }

  function setPlayingState(playing) {
    wantPlay = playing;
    localStorage.setItem(LS_PLAYING, playing ? "true" : "false");
    if (playBtn) {
      playBtn.textContent = playing ? "■" : "♪";
      playBtn.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
      playBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    }
  }

  function tryPlay() {
    if (!audioReady || !wantPlay) return;
    var promise = audioEl.play();
    if (promise !== undefined) {
      promise.then(function () {
        setPlayingState(true);
      }).catch(function (err) {
        /* Autoplay blocked — inform user */
        setPlayingState(false);
        showToast("▶ Click ♪ to start music (browser blocked autoplay)");
      });
    }
  }

  /* Fetch HEAD to check if asset exists without downloading it */
  fetch(AUDIO_SRC, { method: "HEAD" })
    .then(function (res) {
      if (res.ok) {
        audioEl.src = AUDIO_SRC;
        audioReady = true;
        loadSavedPrefs();
        if (audioControls) audioControls.hidden = false;
        /* If user previously wanted music, attempt resume after first gesture */
        if (wantPlay) {
          document.addEventListener("click", function onFirstClick() {
            document.removeEventListener("click", onFirstClick);
            userGestured = true;
            tryPlay();
          }, { once: true });
        }
      }
      /* else: file not found → leave audio UI hidden */
    })
    .catch(function () { /* network error → leave audio UI hidden */ });

  /* Play/Pause button */
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      userGestured = true;
      if (audioEl.paused) {
        setPlayingState(true);
        tryPlay();
      } else {
        audioEl.pause();
        setPlayingState(false);
      }
    });
  }

  /* Volume slider */
  if (volSlider) {
    volSlider.addEventListener("input", function () {
      audioEl.volume = parseFloat(volSlider.value);
      localStorage.setItem(LS_VOLUME, volSlider.value);
    });
  }

  /* Persist pause when user navigates away */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audioEl.paused) {
      audioEl.pause();
    } else if (!document.hidden && wantPlay && audioReady) {
      tryPlay();
    }
  });

})();
