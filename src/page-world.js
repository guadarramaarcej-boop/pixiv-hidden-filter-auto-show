(() => {
  "use strict";

  if (window.__pixivDgwLoaded) return;
  window.__pixivDgwLoaded = true;

  const DGW_PARAM = "dgw";
  const DGW_VALUE = "1";
  const FOLLOWERS_URL = "https://www.pixiv.net/bookmark_new_illust_r18.php";
  const SETTINGS_CACHE_KEY = "__pixivDgwSettings";

  let enabled = true;
  let redirectHome = false;

  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      const s = JSON.parse(cached);
      if (typeof s.enabled === "boolean") enabled = s.enabled;
      if (typeof s.redirectHome === "boolean") redirectHome = s.redirectHome;
    }
  } catch (_e) {}

  function isPixivSearchPage(url) {
    try {
      const u = new URL(url, location.href);
      if (u.hostname !== "www.pixiv.net") return false;
      const path = u.pathname;
      return path.includes("/tags/") || path.includes("/search");
    } catch (_e) {
      return false;
    }
  }

  function shouldAddDgwToApi(u) {
    if (u.hostname !== "www.pixiv.net") return false;
    const path = u.pathname;
    return (
      path.startsWith("/ajax/search/") ||
      path.startsWith("/ajax/tags/") ||
      path.startsWith("/rpc/search")
    );
  }

  function hasDgw(url) {
    try {
      return (
        new URL(url, location.href).searchParams.get(DGW_PARAM) === DGW_VALUE
      );
    } catch (_e) {
      return false;
    }
  }

  function withDgw(url) {
    const u = new URL(url, location.href);
    u.searchParams.set(DGW_PARAM, DGW_VALUE);
    return u.toString();
  }

  function isHomePageLink(url) {
    try {
      const u = new URL(url, location.href);
      if (u.hostname !== "www.pixiv.net") return false;
      const path = u.pathname.replace(/\/+$/, "");
      if (path === "") return true;
      if (/^\/[a-z]{2}$/.test(path)) return true;
      return false;
    } catch (_e) {
      return false;
    }
  }

  const origPushState = history.pushState;
  const origReplaceState = history.replaceState;
  const origFetch = window.fetch;
  const OrigXHROpen = XMLHttpRequest.prototype.open;

  function transformHistoryUrl(url) {
    if (url == null) return url;
    try {
      const target = new URL(url, location.href);
      if (target.hostname !== "www.pixiv.net") return url;
      if (redirectHome && isHomePageLink(target.href)) {
        return "__REDIRECT__";
      }
      if (
        enabled &&
        isPixivSearchPage(target.href) &&
        !hasDgw(target.href)
      ) {
        return withDgw(target.href);
      }
    } catch (_e) {}
    return url;
  }

  history.pushState = function (state, title, url) {
    const transformed = transformHistoryUrl(url);
    if (transformed === "__REDIRECT__") {
      window.location.href = FOLLOWERS_URL;
      return;
    }
    return origPushState.call(this, state, title, transformed);
  };

  history.replaceState = function (state, title, url) {
    const transformed = transformHistoryUrl(url);
    if (transformed === "__REDIRECT__") {
      window.location.href = FOLLOWERS_URL;
      return;
    }
    return origReplaceState.call(this, state, title, transformed);
  };

  window.fetch = function (input, init) {
    if (enabled) {
      try {
        const urlStr =
          typeof input === "string"
            ? input
            : input && typeof input.url === "string"
            ? input.url
            : null;
        if (urlStr) {
          const u = new URL(urlStr, location.href);
          if (
            shouldAddDgwToApi(u) &&
            u.searchParams.get(DGW_PARAM) !== DGW_VALUE
          ) {
            u.searchParams.set(DGW_PARAM, DGW_VALUE);
            if (typeof input === "string") {
              input = u.toString();
            } else {
              input = new Request(u.toString(), input);
            }
          }
        }
      } catch (_e) {}
    }
    return origFetch.call(this, input, init);
  };

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (enabled && url != null) {
      try {
        const u = new URL(url, location.href);
        if (
          shouldAddDgwToApi(u) &&
          u.searchParams.get(DGW_PARAM) !== DGW_VALUE
        ) {
          u.searchParams.set(DGW_PARAM, DGW_VALUE);
          url = u.toString();
        }
      } catch (_e) {}
    }
    return OrigXHROpen.call(this, method, url, ...rest);
  };

  function fixCurrentUrl() {
    if (!enabled) return;
    if (!isPixivSearchPage(location.href)) return;
    if (hasDgw(location.href)) return;
    try {
      origReplaceState.call(history, history.state, "", withDgw(location.href));
    } catch (_e) {}
  }

  fixCurrentUrl();

  window.addEventListener("popstate", fixCurrentUrl);
  window.addEventListener("hashchange", fixCurrentUrl);

  document.addEventListener(
    "click",
    (event) => {
      if (!redirectHome) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target =
        event.target && event.target.closest
          ? event.target.closest("a[href]")
          : null;
      if (!target) return;
      if (!isHomePageLink(target.href)) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      window.location.href = FOLLOWERS_URL;
    },
    true
  );

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.__pixivDgw !== true) return;

    if (data.type === "SET_SETTINGS") {
      const s = data.settings || {};
      enabled = Boolean(s.enabled);
      redirectHome = Boolean(s.redirectHome);
      if (enabled) fixCurrentUrl();
      return;
    }

    if (data.type === "UPDATE_SETTINGS") {
      const s = data.settings || {};
      if ("enabled" in s) {
        enabled = Boolean(s.enabled);
        if (enabled) fixCurrentUrl();
      }
      if ("redirectHome" in s) {
        redirectHome = Boolean(s.redirectHome);
      }
      return;
    }

    if (data.type === "APPLY_NOW") {
      try {
        if (isPixivSearchPage(location.href)) {
          window.location.replace(withDgw(location.href));
        }
      } catch (_e) {}
    }
  });
})();
