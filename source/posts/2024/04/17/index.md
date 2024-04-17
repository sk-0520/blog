---
title: WPFに対する WebView のあれこれと Pe の内蔵ブラウザ破棄と WebView2 への移行
date: 2024-04-17T22:00:00+09:00
layout: layouts/post.njk
tags:
  - C#
  - Pe
---

Pe(0.99.229) のブラウザコントロールを [WebView2](https://developer.microsoft.com/ja-jp/microsoft-edge/webview2/?form=MA13LH) に切り替えた。

もともと [CefSharp](https://cefsharp.github.io/) を使用していたがこの保守やらなんやら Pe の機能的にもう釣り合わなくなってきたので `WebView2` に切り替えた。  
そもそも `CefSharp` を使い始めたのが順序としてあれこれあって、

1. もともと [WebBrowser](https://learn.microsoft.com/ja-jp/dotnet/desktop/winforms/controls/webbrowser-control-overview?view=netframeworkdesktop-4.8) を使用していた
1. 地味に JS やら CSS の補正が必要で気持ち辛かった
1. Pe と関係ない MnMn 実装時に `WebBrowser` に依存せずブラウザバージョンを新しくしつつバージョンを指定したかったので GeckoFX を用いた
1. Pe を .NET Core で組みなおす際に `WebBrowser` 使う決断が出来なくて `CefSharp` を使用するようにした
   * これが原因で Visual C++ 再頒布可能パッケージ やら環境変数の設定などよくわからん処理が必要になった
   * その代わりに WebView としては結構まぁいい感じになった
     * ついでにプラグインウィジェットとして HTML 的な機能が使えるようになった
       * でも IME が死んでて全然使い道なかった
1. 時は移り、MS が `WebView2` の整備してくれて Windows7/8系列も死に絶えて(要出典)、10 でもまぁ多分大丈夫そうってことで Pe の WebView は `WebView2` に切り替えた
   * メリット
     * MS が保守してくれる
       * 最強すぎる
     * Pe 的にはアーカイブサイズが 70 MB くらい軽くなった
       * .NET8 ランタイムを含んでるので結局 50 MBくらいあるけど
   * デメリット
     * プラグインウィジェットとして HTML は破棄した
       * 現行 interface にどうやっても合わせられなかった
     * デメリットではないが個人的には [HwndHost](https://learn.microsoft.com/ja-jp/dotnet/api/system.windows.interop.hwndhost?view=windowsdesktop-8.0) ではなく [Control](https://learn.microsoft.com/ja-jp/dotnet/api/system.windows.controls.control?view=windowsdesktop-8.0) 派生にしてほしかったなぁ
       * べつに回転も拡縮もしないけどさ
     * 止まってもいいから同期的初期化処理ほしい


