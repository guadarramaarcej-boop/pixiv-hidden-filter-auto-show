# Chrome Web Store listing — copy/paste reference

> All copy below is intentionally neutral and clinical. Pasting this
> verbatim into the Chrome Web Store dashboard should pass review on the
> first attempt.

---

## Item name (English)

```
Pixiv Hidden Filter Auto Show
```

## Short / summary description (≤132 characters)

```
Always shows works hidden by Pixiv's search filter by automatically adding dgw=1 to search and tag URLs.
```

## Detailed description (English)

```
Pixiv resets its "Works that may not be relevant to your search" filter on
every new search, so even if you choose to show the hidden works once, the
next query hides them again. This extension fixes that.

Features
• Automatically appends dgw=1 to every Pixiv search and tag URL so hidden
  results are always shown.
• Survives Pixiv's in-page navigation: the parameter is kept when you
  click tags, paginate, change sort order, or use the back/forward buttons.
• Optional toggle: redirect clicks on the Pixiv home logo to your
  followers' new-works feed instead of the recommendations page.
• Popup with a single on/off toggle, status indicator, and an
  "Apply to current page" button for one-click application to an open tab.
• Available in English and Japanese — the popup automatically picks the
  user's browser language.

How it works
The extension's content script runs only on pixiv.net pages. It inspects
URLs in the address bar (and Pixiv's own AJAX requests for search and tag
results) and adds the dgw=1 query parameter when missing. No other web
traffic is touched.

Privacy
The extension does not collect, transmit, log, or share any personal data.
It stores only two local boolean settings (the on/off toggles) using your
browser's built-in sync storage. It does not contact any external server.

Permissions
• storage — to persist the on/off toggle.
• tabs — used only by the popup's "Apply to current page" button.
• host access to www.pixiv.net — required so the content script can run on
  Pixiv pages.

This is an unofficial, fan-made tool. It is not affiliated with, endorsed
by, or sponsored by pixiv Inc.
```

## Detailed description (Japanese)

```
Pixivは検索のたびに「検索条件に合わない作品」フィルターをリセットするため、
一度「表示」を選んでも、新しい検索を行うと再び非表示になってしまいます。
この拡張機能はその挙動を修正します。

機能
• Pixivの検索・タグページのURLに自動的に dgw=1 を付与し、非表示にされた
  作品が常に表示されるようにします。
• Pixivのページ内ナビゲーションにも対応：タグのクリック、ページめくり、
  並び替え、戻る／進むボタンの操作後もパラメータが保持されます。
• オプション機能：Pixivのロゴをクリックしたとき、おすすめページではなく
  フォロー中ユーザーの新着作品ページに移動するように切り替え可能。
• ポップアップにはオン／オフトグル、ステータス表示、現在のページに
  即時適用するボタンを搭載。
• 英語と日本語に対応。ブラウザのUI言語に合わせて自動的に切り替わります。

動作の仕組み
コンテンツスクリプトは pixiv.net 上でのみ動作し、アドレスバーのURLおよび
Pixivが行う検索／タグ取得用のAJAXリクエストを検査し、dgw=1 が含まれて
いない場合に付与します。他のウェブ通信には一切影響しません。

プライバシー
個人情報の収集・送信・記録・共有は行いません。ブラウザ標準の同期ストレージ
を用いて、オン／オフ設定（ブール値2つ）のみをローカルに保存します。
外部サーバーへの通信は一切行いません。

権限について
• storage — オン／オフ設定の保存に使用。
• tabs — ポップアップの「現在のページに適用」ボタンでのみ使用。
• www.pixiv.net へのアクセス — Pixivページでコンテンツスクリプトを動作
  させるために必要。

本拡張機能は非公式のファンメイドツールです。ピクシブ株式会社とは一切の
関係がありません。
```

## Category

```
Productivity
```

## Search terms / tags

```
pixiv, search filter, dgw, hidden works, followers feed
```

## Privacy practices — answers to paste

| Form field | Answer |
|---|---|
| Single purpose | Modify Pixiv search and tag URLs by adding the dgw=1 query parameter so works that Pixiv hides behind its default search filter are shown. |
| Why `storage`? | To persist the user's on/off toggle settings (extension-wide enable, and home-logo redirect). |
| Why `tabs`? | Only the popup uses it, and only when the user clicks "Apply to current page", in order to send a message to the active tab's content script. The extension reads the active tab's URL only to verify it is a pixiv.net page before sending the message. |
| Why host access to `www.pixiv.net`? | So the content script can run on Pixiv pages to inspect and rewrite the URL query string. |
| Data collected | None of the listed categories. The extension does not collect any user data. |
| Sells/transfers data to third parties | No. |
| Uses data for purposes unrelated to single purpose | No. |
| Uses data to determine creditworthiness or lending | No. |

## Privacy policy URL

Use the URL of the gist you created from `PRIVACY.md`. Format example:
`https://gist.github.com/<your-username>/<gist-id>`

## Visibility

`Public` (recommended) — so it appears in store search results.

## Regions

`All regions`

---

## Screenshot guidance

You need at least one screenshot. **1280×800 PNG** is the safest size.

Good first screenshots to capture:

1. **The popup over a Pixiv tag page.** Open `https://www.pixiv.net/en/tags/<a tame tag like "scenery">/artworks?dgw=1`, click the extension icon, then screenshot the whole browser viewport.
2. **The address bar close-up** showing `?dgw=1` appended to a search URL.
3. **The popup in Japanese** if you want to show the localization — switch your browser's UI language to Japanese, reopen the popup, and screenshot.

Pick neutral search tags (scenery, animals, anime characters, etc.) so the
screenshots don't get flagged for mature content.

---

## Promo tile

`store-promo-440x280.png` is included in the project root. Upload it as the
"Small promotional tile" in the Chrome Web Store dashboard.
