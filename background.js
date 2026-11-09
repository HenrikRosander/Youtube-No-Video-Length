// Firefox provides `browser`, Chrome provides `chrome`; both return promises in MV3.
const api = globalThis.browser ?? globalThis.chrome;

// Shows an "off" badge on the toolbar icon while spoiler protection is disabled.
function showState(enabled) {
  api.action.setBadgeText({ text: enabled ? "" : "off" });
  api.action.setBadgeBackgroundColor({ color: "#666" });
}

function refresh() {
  api.storage.local.get({ enabled: true }).then(({ enabled }) => showState(enabled));
}

// Chrome's service worker isn't kept alive, and the badge doesn't survive a
// browser restart, so redraw it whenever the worker wakes for these events.
api.runtime.onStartup.addListener(refresh);
api.runtime.onInstalled.addListener(refresh);
refresh();

api.storage.onChanged.addListener((changes) => {
  if (changes.enabled) showState(changes.enabled.newValue);
});
