---
title: "[備忘録] PATH 通してない git であれこれする"
date: 2024-08-16T21:00:00+09:00
layout: layouts/post.njk
tags:
  - memorandum
  - git
  - bat
  - TortoiseGit
---

* TortoiseGit をインストールしている環境前提
  * TortoiseGit 経由で諸々いい感じに処理出来てる前提
  * SSH 周りで push/pull をふんわり解決
* git を PATH に通すと Windows にないコマンド使えるようになってあれこれ便利になるけどそれを含めたあれこれを外部提供して あああああああああああああああああああああ ってなるから PATH 通さない派閥用

```bat
cd /d %~dp0

set GIT_SSH=%PROGRAMFILES%\TortoiseGit\bin\TortoiseGitPlink.exe

"%PROGRAMFILES%\Git\bin\sh.exe" %*
```

[昔のやつ](../../../2023/08/20/)
