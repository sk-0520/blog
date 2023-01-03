---
title: ソース管理サービスを Bitbucket から GitHub に移って 2-3 か月経ちました
description: 移行記事
date: 2022-12-07T22:00:00+09:00
tags:
  - Bitbucket
  - GitHub
layout: layouts/post.njk
---
* GitHub が速い
  * Bitbucket がページ遷移も含めて謎の遅さ
  * pjax とかそういう見かけの処理の話じゃなくて多分サーバーの物理的距離だと思う
    * オーストラリアだと速いんじゃないかな。知らんけど
* CI 処理
  * 結構制限時間のきつい Bitbucket pipeline
    * 無料文句も言えないけど 50 分は試すまでもなく別サービスを選定することになる
    * Pe(Pe.Boot) のビルドに windows 環境が必要で [AppVeyor](https://www.appveyor.com/) を使うことにしたけど遅い・並列死んでる
      * サービス自体はいいんだけどリリース前にこの遅さがすごい辛い。無料枠だから文句言えないけど
      * でも Pe とかほかのアプリでも頑張ってくれたのですごい助かった
  * 公開リポジトリなら GitHub Actions で GitHub 完結できるのがすごい楽ちん
    * GitHub 内で[ユーザー作成サービス](https://github.com/marketplace)が使えるのもありがたい
      * ただそのおかげというか副作用というか、 Actions の仕様変更に思いっきり引っ張られる気がする
        * nodejs の最低バージョンとか、 `set-output` の[仕様変更](https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/)とか
* 課題管理
  * これに関しては個人的に Bitbucket が好み
    * GitHub の課題管理があんまり好きじゃない
  * 好き嫌いはともかく課題の移行がクソほどしんどかった
    * 情報は資産であり人質
    * 移行用に[ツール作る謎作業](https://github.com/sk-0520/issue-bb2gh)があってつらつら
      * いつかまた使うかもしれない or 困ってる人がいるかもしれないのでいつか記事書く
* PR は知らん。いつもひとりぼっち
* Bitbucket の ダウンロードの仕組みはよかった
  * GitHub だとリリースにくっつけるか何か別の仕組みが必要な気がする
    * くっそみたいな要求シナリオとして特定のバージョンの特定のプラグインを突っ込んだ Eclipse を zip で固めて上げときたい欲
      * 個人アプリで Java 使わんけどまぁそんなイメージ
