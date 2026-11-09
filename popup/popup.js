// Firefox provides `browser`, Chrome provides `chrome`; both return promises in MV3.
const api = globalThis.browser ?? globalThis.chrome;

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function render(enabled) {
  toggle.setAttribute("aria-pressed", String(enabled));
  status.textContent = enabled ? "Lengths hidden" : "Lengths visible";
}

api.storage.local.get({ enabled: true }).then(({ enabled }) => render(enabled));

toggle.addEventListener("click", () => {
  const enabled = toggle.getAttribute("aria-pressed") !== "true";
  api.storage.local.set({ enabled });
  render(enabled);
});
