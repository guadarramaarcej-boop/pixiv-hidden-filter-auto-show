# Privacy Policy — Pixiv Hidden Filter Auto Show

**Last updated:** 2026-05-19

## Summary

Pixiv Hidden Filter Auto Show does not collect, transmit, log, store on any
remote server, or share any personal data of any kind.

## What the extension stores locally

The extension stores exactly two boolean settings using your browser's
built-in `storage.sync` API:

- `enabled` — whether the URL-rewriting feature is on (default: on).
- `redirectHome` — whether clicks on the Pixiv home logo are redirected to
  your followers' new-works feed (default: off).

These settings are stored locally on your device. If your browser is
configured to sync settings across devices, the browser itself may sync them
between your own browser profiles. The extension never has access to any
remote storage of its own.

## What the extension does to web traffic

On `https://www.pixiv.net/` pages only, the extension may:

1. Append `dgw=1` to search and tag URLs in the address bar.
2. Append `dgw=1` to Pixiv's own AJAX requests for search and tag results.
3. (Optional, off by default) Redirect clicks on the Pixiv home logo to
   `https://www.pixiv.net/bookmark_new_illust_r18.php`.

The extension does not modify any other web traffic, does not read or
exfiltrate page content, and does not interact with Pixiv account data,
cookies, or session information.

## Third parties

The extension contacts no third-party servers. It contacts no
first-party servers either. It performs no network requests of its own.

## Permissions

- `storage` — to persist the two boolean settings above.
- `tabs` — used only by the popup's "Apply to current page" button to send a
  message to the active tab's content script. Tab URLs are read only when
  the button is clicked, only for the active tab, and only to check whether
  it is a `pixiv.net` URL before sending the message.
- Host permission `https://www.pixiv.net/*` — required so the content script
  can run on Pixiv pages to perform the URL rewriting described above.

## Contact

Issues and questions: contact the publisher (Tdevy) via the listing's
"Support" / "Report abuse" link on the Chrome Web Store, Firefox Add-ons,
or Microsoft Edge Add-ons store page.
