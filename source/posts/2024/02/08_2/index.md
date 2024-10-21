---
title: Pe API サーバー切り替え
date: 2024-02-08T22:30:00+09:00
layout: layouts/post.njk
tags:
  - Pe
  - domain
---

新バージョン: https://peserver.site/

Pe 0.99.221 以下は自動バージョンアップが動かないので以下を変更する必要あり。

`<Pe>\etc\appsettings.json`

```diff
{
  "general": {
-    (現)"version_check_uri": "https://peserver.gq/api/application/version/update"
+    (新)"version_check_uri": "https://peserver.site/api/application/version/update"
  }
}
```

なお、この設定は 0.99.222 で `version_check_url_items` に置き換わるので 0.99.211 以下でのみ有効。

----------------

バージョンアップが出来なくなるとほんとつらい。
