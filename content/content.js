// Firefox provides `browser`, Chrome provides `chrome`; both return promises in MV3.
const api = globalThis.browser ?? globalThis.chrome;

const REVEAL_CLASS = "ynvl-reveal";
const SKIPS = [
  [-300, "−5m"],
  [-60, "−1m"],
  [-10, "−10s"],
  [10, "+10s"],
  [60, "+1m"],
  [300, "+5m"],
];

function applyState(enabled) {
  document.documentElement.classList.toggle(REVEAL_CLASS, !enabled);
}

api.storage.local.get({ enabled: true }).then(({ enabled }) => applyState(enabled));

api.storage.onChanged.addListener((changes) => {
  if (changes.enabled) applyState(changes.enabled.newValue);
});

function skip(player, seconds) {
  const video = player.querySelector("video");
  if (!video || player.classList.contains("ad-showing")) return;

  // seekable, not duration: on live streams it marks the real start and end.
  const { seekable } = video;
  const last = seekable.length - 1;
  const min = last >= 0 ? seekable.start(0) : 0;
  const max = last >= 0 ? seekable.end(last) : video.duration;
  video.currentTime = Math.max(min, Math.min(max, video.currentTime + seconds));
}

function buildSkipBar(player) {
  const bar = document.createElement("div");
  bar.className = "ynvl-skip";

  for (const [seconds, label] of SKIPS) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => {
      skip(player, seconds);
      button.blur(); // otherwise Space would re-press this instead of pausing
    });
    bar.append(button);
  }

  // Keep clicks from reaching the player, which would pause or go fullscreen.
  for (const type of ["click", "dblclick", "mousedown", "mouseup"]) {
    bar.addEventListener(type, (event) => event.stopPropagation());
  }
  return bar;
}

function addSkipBars() {
  const players = document.querySelectorAll(
    ".html5-video-player:not(#inline-preview-player):not(#shorts-player)"
  );
  for (const player of players) {
    const controls = player.querySelector(".ytp-chrome-bottom");
    if (controls && !controls.querySelector(".ynvl-skip")) {
      controls.append(buildSkipBar(player));
    }
  }
}

// YouTube swaps pages without reloading, so players can appear at any time.
let pending = false;
new MutationObserver(() => {
  if (pending) return;
  pending = true;
  setTimeout(() => {
    pending = false;
    addSkipBars();
  }, 500);
}).observe(document.documentElement, { childList: true, subtree: true });
