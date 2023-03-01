---
title: バックアップ体制を Nextcloud と B2 Cloud Storage で構築した
description: 移行記事
date: 2020-05-30T17:08:00+09:00
tags:
  - Nextcloud
  - B2 Cloud Storage
layout: layouts/post.njk
---
先週メイン使用のデスクトップが死んでついでにデータ用のHDDがすべて死んだ悲しみを繰り返さないためにバックアップ体制を構築した(というかデータが主に悲しみの原因)。
まず OS の載っているストレージについては正直どうでもいいのでバックアップはできたらいいな程度に考え、データ用のストレージ冗長化を主眼に置いた。

手っ取り早くは NAS 買ってきてそこにデータ突っ込むというのが無難だと思ったけど電源つけっぱなしは精神的にしんどいし毎回電源ON/OFFするのも気持ちしんどい。
なので外部(インターネット越し)に配置したいと思ったが選択肢が多くてあれやこれや考えた結果、B2 Cloud Storage を選んだ。

B2 Cloud 自体はブラウザで開いてアップロードしたりできるがどうにも面倒なので Windows Explorer 上の OneDrive みたいに透過的に扱いたかったのでクライアントソフトを探したが
よくわからん + データ喪失の悲しみであんまりやる気ない状態だったので手っ取り早そうな Nextcloud クライアントソフトを使用することにした。
B2 Cloud は S3 互換の API を扱えるので S3 を扱える Nextcloud(サーバー側) にストレージ整理を任せて、Nextcloud クライアント側に Windows との連携を任せることにした。

## B2 Cloud Storage を使用/ストレージの作成

まずは `https://www.backblaze.com/b2/cloud-storage.html` にアクセスしてアカウントを作成する。

B2 Cloud Storage (以下 B2) はカード情報がなくても 10 GB まで保存できるので動作確認・使用感を得るには都合がよい。なによりカード入力しなくても試せる安心感がすごい。

サインインしたら Nextcloud とやり取りさせるために設定を行っていく。

1. [メニュー] Bucket
  1. Create a Bucket
    1. バケット名は適当に入力（入れるデータに合わせた名前）
    1. 公開範囲も適当に設定（バックアップの意味合いから private が普通だと思う）
1. [メニュー] App Keys
  1. Add a New Application Key
    1. キー名を適当に入力
    対象バケットの選択で API キーを制限しないなら ALL 、バケットごとに制限するなら対象を選択
    1. アクセス権限を All に設定
    1. その他オプションは必要な入力
    1. 出来上がった API キー の *Secret* をメモっておく

これで B2 の準備は完了。


## Nextcloud のインストール

すでに使用可能な Nextcloud が存在すればこれは不要。

ここでは Nginx の稼働している CentOS8 を対象として、 snap を用いる。
Nextcloud 自体を直接動かしたいなら止めはしないけどやりたいのはバックアップであって Nextcloud の世話ではないので保守は snap に任せる。

```bash
# dnf install snapd -y
# systemctl start snapd
# snap install nextcloud
Warning: /var/lib/snapd/snap/bin was not found in your $PATH. If you've not restarted your session
         since you installed snapd, try doing that. Please see https://forum.snapcraft.io/t/9469
         for more details.
```

これでインストールは完了。
ただこの時点ではまだ起動していないし、PATH に追加された内容も反映されていないのでいったんログアウトするなりして PATH を最新化する。

次に Nginx のリバースプロキシ設定を行う。
適当なディレクティブに適当に設定値を入力。

```
http {
 ...
 # アップロードサイズの変更
 client_max_body_size 5g;

 ...

 server {
  ...
  
  # リバースプロキシとして動作させる
  location /<NextcloudのURLパス> {
   rewrite ^/<NextcloudのURLパス>(.*) $1 break;
   proxy_pass http://<Nextcloud稼働IPアドレス>:<Nextcloudのポート>;
  }
  
  ...
 }
}
```

```
# systemctl reload nginx
```

これで Nginx 側の設定ができたので Nextcloud を構築していく。

```
# snap set nextcloud ports.http=<Nextcloudのポート>
# nextcloud.manual-install <ログインユーザー名> <ログインパスワード>
# nextcloud.occ config:system:set trusted_domains 1 --value=<リバースプロキシホスト>
# nextcloud.occ config:system:set overwritehost --value="<リバースプロキシホスト>"
# nextcloud.occ config:system:set overwriteprotocol --value="<リバースプロキシプロトコル>"   ※ http / https のどっちか
# nextcloud.occ config:system:set overwritewebroot --value="/<NextcloudのURLパス>"
# nextcloud.occ config:system:set overwrite.cli.url --value="<稼働プロトコル>://<リバースプロキシホスト>/<NextcloudのURLパス>"
```

これで設定OKなので <稼働プロトコル>://<リバースプロキシホスト>/<NextcloudのURLパス> にアクセスする。
※起動してなかったら起動しておくこと (多分 -> `# snap start nextcloud` )
※同一ホスト内だと selinux 周りで死ぬかも(一応の対応 -> `# setsebool httpd_can_network_connect on -P` )

## Nextcloud の設定

(移植できんかった)

```
1. とりまログインしたら右上のアバターアイコンから アプリを選択
  1. 「External storage support」を検索して有効にする
1. 右上のアバターアイコンから 設定 を選択
  1. 左メニュー 管理欄 の「外部ストレージ」
    1. 「フォルダー名」を適当に入力
    1. 「ストレージを追加」から「Amazon S3」を選択
    1. 「バケット名」に作成したバケット名を入力
    1. 「ホスト名」にバケットのEndpointを入力
    1. 「ポート」は空白
    1. リージョンに「バケットのEndpointのリージョンっぽいのを設定
      * s3.**us-west-002**.backblazeb2.com なら **us-west-002**
      * 作業中にどこかのページで見て知ったけどURL失念
    1. 「SSLを有効」をチェック
    1. 「パス形式を有効」をチェック（なんのこっちゃ知らん）
    1. 「レガシー認証(v2)」は非チェック
    1. 「アクセスキー」に作成した API キーの「keyID」を入力
    1. 「シークレットキー」に作成した API キーのメモしておいた *Secret* を入力
    1. ✔ をクリック
```

## 構築完了

これで Nextcloud と B2 を連携が完了する。
あとは [Nextcloud クライアント](https://nextcloud.com/install/#install-clients) を PC にインストールして連携すればOK。

* B2 を使えば無料+カード情報なし(電話番号は必要)で 10 GB まで扱える
  * API 使用に関してもある程度まで同じ
* 10 GBを超えたい、API使用数を増やしたいと思うまで無料運用可能
* B2 連携した場合 Nextcloud 上にファイルは格納されない(一時ファイルは知らん)
* **良い点**
  * 意外と速度が速かった
  * Nextcloud クライアントアプリがアップロード失敗時に自動リトライ処理してくれる
  * Nextcloud クライアントアプリがリネームも検知してくれる
    * B2 側にも一応対応してくれてるっぽいけど遅い(?)
* **悪い点**
  * B2 提供サイト [backblaze](https://www.backblaze.com/) は右下で言語変えれられるけど機械翻訳で完全に何言ってるのかわからないサイトになるので素直に英語表示した方がいい
* **まだ分かってないところ**
  * クライアント側未ダウンロードでアイコン表示が可能か
    * 絶対ダウンロードされる？ 試してないから知らんけど
  * Nextcloud による API 使用料がちょっとまだ読めない
    * 時間がたてばどれくらいっていう目測ができるようになると思うけど導入したばっかなのできつい
