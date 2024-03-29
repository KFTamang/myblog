+++
title = "本質から理解するgit 改訂版"
subtitle = ""
date = "2022-03-30T21:00:09+09:00"
author = "KFTamang"
image = ""
tags = [
  "git",
  "software"
]
categories = [
  "Tech"
]
description = "gitをより理解し使いこなすため、gitのコミットをどう捉えどう使うのがよいか解説します。ソースコードはコンパイルエラーや実行時エラーなどがなく、テストの通る状態でコミットされるべきです。ここまでは動作するという基盤を少しずつ拡張していくことで、開発をよりスムーズに進める助けとなります。コミットをどの程度の頻度で行うかは開発チームによりますが、基本的に機能ごとにコミットを区切るとよいでしょう。"
googleAnalytics = "UA-83537418-2"

copyright = "KFTamang All rights reserved"

+++

## 前書き
以前、[本質から理解するgit](https://kftamang.github.io/post/git/)という記事を書きました。
書きましたが、今読み直してみると技術的な枝葉についての記載が多く、とても本質から理解する助けになるとは言えないわかりづらい記事でした。
ちょうど仕事でgitを使う機会もあり理解も深まったと思うので、いまいちど本質から理解する助けとなれるような記事を目指して書いてみようと思います。

## gitの難しさ
本題に入る前にgitが難しいと言われる理由を考えてみました。
私は大きく二つの理由があると考えています。

1. gitを使う意味がわからない
1. 中心的なデータ構造が見えにくい

このうち2番目はこの記事で詳しく記述するので、1番目について簡単に説明します。

gitはもともと複数人が一つのソースコードを共有しながら開発を進めるために開発されたソフトウェアだそうです。[参考：開発者のTech Talk](https://www.youtube.com/watch?v=4XpnKHJAok8)

これが、特にプログラミング初心者にとってgitが難しいと感じる理由です。
複数人での開発経験がどのようなものかわかっていないと、様々な機能が具体的にどのような場面で有用なのかというユースケースを想像できません。その結果、機能の真の意味を理解したり、学習のモチベーションを維持することができません。

ではどうすればいいかというと、複数人での開発を体験しろとしか言えません。個人的にはお金をもらってバイトしながら使い方を学んだ時に、もっとも理解が深まりました。

今回書きたいことの本題ではないため、前置きはこのくらいにしましょう。
次の章からはgitの構造を説明します。

## gitの中心となるデータ構造
gitを理解するための核は**コミット**と、複数のコミットが形成する**コミットツリー**というデータ構造です。
コミットツリーがどのようなものか理解してしまえば、gitの様々なコマンドがコミットツリーに対するどのような操作か理解できます。

### コミットの構造
まずはコミット単体の構造から説明します。といっても要点は以下の二つだけです。

1. コミットは、そのコミットにおけるすべてのファイルの情報を持つ
1. コミットは中身のファイルによって一意に決まる文字列（ハッシュ値）で管理される

1番が言いたいのは、あるコミットを復元するのに必要な情報はそのコミットに含まれており、始まりからの履歴を全部追ったりしなくていいということです。（変更していないファイルについてもすべてです。それでもデータ量が爆発的に増えないように賢い工夫をしています。詳しくは調べてください。）

2番は、ハッシュ値という値があればコミットを一意に指定できることが分かれば十分です。

大したことはないですね。

## コミットツリーの構造
さて、ポイントはここからです。コミットはひとつ前のコミット（親コミット）のハッシュ値を持っています。つまりあるコミットからどんどん親をたどることができて、最終的にただ一つのコミット（最初のコミット）まで到達することができます。

このコミット全体が作る構造をコミットツリーといいます。（新しいコミットを上に作っていけば、樹状の構造ができますね。）

これだけです。拍子抜けですね。

## いくつかのコマンドが行っていること
では上で説明したことを使って、gitが何をやっているか具体的に解説しましょう。

### ブランチ
gitのブランチはどのように実現しているのでしょうか。
実はブランチの実体は、コミットを指定するハッシュ値一つです。

このコミットが、そのブランチの最新のコミットです。
コミットがわかれば、最初のコミットまでずっと辿っていけるのでした。
このコミットの連なりがブランチです。

### checkout
checkoutはコミットの中身のファイルをすべてワーキングディレクトリにコピーします。
すべてのファイルの情報がコミットに含まれているので、コミットを指定するだけでスナップショットを再現できます。

そうです。checkoutはコミットを指定できます。ためしに`git checkout ハッシュ値`を実行してみてください。コミットがチェックアウトできます。

checkoutにブランチを指定したら？
ブランチはコミットのハッシュ値を一つ持っているのでした。このコミットを展開すればブランチの最新状態のチェックアウトが完了ですね。

### diff
慣れてきたらよく使うコマンドが`git diff コミット1 コミット2`です。
これはコミット二つの中身を比較して、ファイルごとに差分を表示してくれます。これもコミットの比較が基本です。

引数を省略するといい感じに推測して補完してくれているのです。（HEADコミットとか）

### merge
後日追加予定

## まとめ
以上みてきて、以外にシンプルな構造だと驚いたのではないでしょうか。
私は驚きました。

プログラミングの神髄とは、何にどのような操作をしたいかをしっかりと考え定めること、そしてそれを自然に実現ためのデータ構造を考えることだとわかる良い例だと思います。