(() => {
  "use strict";

  const api = typeof browser !== "undefined" ? browser : chrome;

  const STORAGE_DEFAULTS = {
    enabled: true,
    redirectHome: false,
  };

  function injectPageWorld() {
    const url = api.runtime.getURL("src/page-world.js");
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send();
      const code = xhr.responseText;
      if (!code) throw new Error("empty response");
      const s = document.createElement("script");
      s.textContent = code;
      const parent = document.documentElement || document;
      parent.appendChild(s);
      s.remove();
    } catch (_e) {
      try {
        const s = document.createElement("script");
        s.src = url;
        s.async = false;
        (document.documentElement || document).appendChild(s);
      } catch (_e2) {}
    }
  }

  injectPageWorld();

  function postToPage(message) {
    try {
      window.postMessage(
        Object.assign({ __pixivDgw: true }, message),
        location.origin
      );
    } catch (_e) {}
  }

  function getSettings() {
    return new Promise((resolve) => {
      try {
        api.storage.sync.get(STORAGE_DEFAULTS, (result) => {
          const err = api.runtime && api.runtime.lastError;
          if (err) {
            resolve(Object.assign({}, STORAGE_DEFAULTS));
            return;
          }
          resolve({
            enabled: Boolean(result.enabled),
            redirectHome: Boolean(result.redirectHome),
          });
        });
      } catch (_e) {
        resolve(Object.assign({}, STORAGE_DEFAULTS));
      }
    });
  }

  getSettings().then((settings) => {
    postToPage({ type: "SET_SETTINGS", settings });
  });

  if (api.storage && api.storage.onChanged) {
    api.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      const update = {};
      if ("enabled" in changes) {
        const v = changes.enabled.newValue;
        update.enabled = v === undefined ? STORAGE_DEFAULTS.enabled : Boolean(v);
      }
      if ("redirectHome" in changes) {
        const v = changes.redirectHome.newValue;
        update.redirectHome =
          v === undefined ? STORAGE_DEFAULTS.redirectHome : Boolean(v);
      }
      if (Object.keys(update).length === 0) return;
      postToPage({ type: "UPDATE_SETTINGS", settings: update });
    });
  }

  if (api.runtime && api.runtime.onMessage) {
    api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message || typeof message !== "object") return false;

      if (message.type === "APPLY_DGW_NOW") {
        postToPage({ type: "APPLY_NOW" });
        sendResponse({ ok: true, changed: true });
        return false;
      }

      if (message.type === "GET_PAGE_STATUS") {
        sendResponse({ ok: true, href: location.href });
        return false;
      }

      return false;
    });
  }
})();
