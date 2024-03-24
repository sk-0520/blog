---
title: Visual Studio インテリセンス日本語化の半自動化
date: 2023-01-29T13:00:00+09:00
layout: layouts/post.njk
tags:
  - Visual Studio
  - .NET IntelliSense
---

Visual Studio がいつのころからか(.NET Core くらい？)インテリセンスのローカライズは自動じゃなくて手動で適用するようになったじゃないですか。  
（そしてもう保守すらされない的な）

* とりあえず一回適用するくらいなら別にいいけど Visual Studio のアップデート当てた時に対象とランタイムも最新化されて `ja` ディレクトリを古いバージョンから新しいバージョンにちまちまお手々でコピーする作業がもう無理
  * 移動するりゃいいんだけど一応なんかあるかもの精神でコピーするとファイルが残り続けて精神衛生上よくない
    * すでに停止している .NET 5 版ですら展開サイズは 67MB というなんとも大きなサイズが地味に心をチクチクする
* なので適用作業の自動化バッチを作った
  1. 指定したバージョンディレクトリに、
  2. 元となるローカライズディレクトリをシンボリックリンク

## ローカライズファイル

* 配布場所(もはや更新されない) https://dotnet.microsoft.com/ja-jp/download/intellisense
* 備考: https://learn.microsoft.com/ja-jp/dotnet/core/install/localized-intellisense

## バッチファイル

<script src="https://gist.github.com/sk-0520/4f749259ec8a455069f1f75bb7d7d6ca.js"></script>

https://gist.github.com/sk-0520/4f749259ec8a455069f1f75bb7d7d6ca#file-create-dotnet-intellisense-link-bat

## 使い方

1. ローカライズファイル配置用ディレクトリの作成
   * ここでは `C:\LOCALIZE` とする
1. ローカライズアーカイブをローカライズファイル配置用ディレクトリに展開
   * `C:\LOCALIZE\dotnet-intellisense-5.0-ja`
1. ローカライズファイル配置用ディレクトリにバッチファイルを配置
   * `C:\LOCALIZE\create-dotnet-intellisense-link.bat`
1. バッチファイルを状況に合わせて変更
   * | 変数 | 変更 |
     |---|---|
     | `LOCALIZE_LANGUAGE` | 対象言語(たぶん変える必要なし) |
     | `LOCALIZE_SOURCE` | 展開したローカライズファイルのフルパス(たぶん変える必要なし) |
     | `TARGET_BASE_DIR` | 適用先 .NET ディレクトリ(packsまで, たぶん変える必要なし) |
     | `TARGET_DOTNET_STANDARD_MONIKER` | 対象 .NET Standard バージョン(たぶん変える必要なし) |
     | `TARGET_DOTNET_STANDARD_RUNTIME` | 対象 .NET Standard ランタイムバージョン(?)(たぶん変える必要なし) |
     | `TARGET_DOTNET_VERSION_MONIKER` | 対象 .NET バージョン(.NET 7 ならそのままでOK) |
     | `TARGET_DOTNET_VERSION_RUNTIME` | 対象 .NET ランタイムバージョン(**これが状況により変更が必要, 上のほうに書いておけばよかった**) |
1. 管理者権限で `create-dotnet-intellisense-link.bat` を実行

さっきえいやで書いたのでバージョン変更時の挙動とかは不明(.NET Standard が作れないとか文句言われるんだろうけど問題ないはずなので無視無視)
