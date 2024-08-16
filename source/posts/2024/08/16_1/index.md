---
title: "[備忘録] ps1 を bat から起動する"
date: 2024-08-16T21:00:00+09:00
layout: layouts/post.njk
tags:
  - memorandum
  - powershell
  - bat
---

備忘録を書いておくの会。

```bat
cd /d %~dp0

powershell -NoProfile -ExecutionPolicy unrestricted 起動するファイル.ps1 %*
```
