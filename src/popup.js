(() => {
  "use strict";

  const api = typeof browser !== "undefined" ? browser : chrome;

  const DEFAULTS = {
    enabled: true,
    redirectHome: false,
  };

  const toggleEnabledEl = document.getElementById("toggle-enabled");
  const toggleRedirectEl = document.getElementById("toggle-redirect");
  const statusEl = document.getElementById("status");
  const applyBtn = document.getElementById("apply-btn");
  const applyResultEl = document.getElementById("apply-result");

  function t(key) {
    try {
      const msg =
        api.i18n && api.i18n.getMessage ? api.i18n.getMessage(key) : "";
      return msg || "";
    } catch (_e) {
      return "";
    }
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const msg = t(key);
      if (msg) el.textContent = msg;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const msg = t(key);
      if (msg) el.innerHTML = msg;
    });
    document.documentElement.lang = (api.i18n && api.i18n.getUILanguage
      ? api.i18n.getUILanguage()
      : "en"
    ).split("-")[0];
  }

  function getSettings() {
    return new Promise((resolve) => {
      try {
        api.storage.sync.get(DEFAULTS, (result) => {
          const err = api.runtime && api.runtime.lastError;
          if (err) {
            resolve(Object.assign({}, DEFAULTS));
            return;
          }
          resolve({
            enabled: Boolean(result.enabled),
            redirectHome: Boolean(result.redirectHome),
          });
        });
      } catch (_e) {
        resolve(Object.assign({}, DEFAULTS));
      }
    });
  }

  function setSetting(key, value) {
    return new Promise((resolve) => {
      try {
        api.storage.sync.set({ [key]: value }, () => resolve());
      } catch (_e) {
        resolve();
      }
    });
  }

  function getActiveTab() {
    return new Promise((resolve) => {
      try {
        api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          resolve(tabs && tabs[0] ? tabs[0] : null);
        });
      } catch (_e) {
        resolve(null);
      }
    });
  }

  function sendMessageToTab(tabId, message) {
    return new Promise((resolve) => {
      try {
        api.tabs.sendMessage(tabId, message, (response) => {
          const err = api.runtime && api.runtime.lastError;
          if (err) {
            resolve({ ok: false, error: err.message });
            return;
          }
          resolve(response || { ok: false });
        });
      } catch (e) {
        resolve({ ok: false, error: String(e) });
      }
    });
  }

  function updateStatusText(enabled) {
    if (!statusEl) return;
    statusEl.textContent = t(enabled ? "statusEnabled" : "statusDisabled");
    statusEl.classList.toggle("enabled", enabled);
    statusEl.classList.toggle("disabled", !enabled);
  }

  function showApplyResult(text) {
    if (applyResultEl) applyResultEl.textContent = text;
  }

  async function init() {
    applyI18n();

    const settings = await getSettings();
    toggleEnabledEl.checked = settings.enabled;
    toggleRedirectEl.checked = settings.redirectHome;
    updateStatusText(settings.enabled);

    toggleEnabledEl.addEventListener("change", async () => {
      const v = toggleEnabledEl.checked;
      await setSetting("enabled", v);
      updateStatusText(v);
      showApplyResult("");
    });

    toggleRedirectEl.addEventListener("change", async () => {
      await setSetting("redirectHome", toggleRedirectEl.checked);
    });

    applyBtn.addEventListener("click", async () => {
      applyBtn.disabled = true;
      showApplyResult(t("applyApplying"));

      const tab = await getActiveTab();
      if (!tab || !tab.id) {
        showApplyResult(t("applyNoTab"));
        applyBtn.disabled = false;
        return;
      }
      if (!tab.url || !/^https:\/\/www\.pixiv\.net\//.test(tab.url)) {
        showApplyResult(t("applyNotPixiv"));
        applyBtn.disabled = false;
        return;
      }

      const response = await sendMessageToTab(tab.id, {
        type: "APPLY_DGW_NOW",
      });
      if (response && response.ok) {
        showApplyResult(t(response.changed ? "applySuccess" : "applyNoChange"));
      } else {
        showApplyResult(t("applyError"));
      }
      applyBtn.disabled = false;
    });
  }

  init();
})();
