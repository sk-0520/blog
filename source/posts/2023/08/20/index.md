---
title: リクガメ
date: 2023-07-23T22:00:00+09:00
layout: layouts/post.njk
tags:
  - git
  - SSH
  - TortoiseGit
---

特異な例かもしれないけど、Git を PATH 通さずに TortoiseGit を使っていて何の準備もなしに git で SSH した時になんにも動かない用の対応。

前々から何とかしようと思ってたけど `GIT_SSH` が PATH 周りで多分挙動が違うっぽいのが諸悪の根源かなぁと思いつつ詳しいことは知らんけど取り敢えず動く bat ファイル。

<script src="https://gist.github.com/sk-0520/67187a05a3dda8b069a0e5728e4a64d0.js"></script>

