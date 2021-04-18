+++
title = "ブログにp5.jsを埋め込む"
subtitle = ""
date = "2021-04-18T8:00:09+09:00"
author = "KFTamang"
image = ""
tags = [
    "p5.js"
]
categories = [
  "Tech"
]
description = ""
googleAnalytics = "UA-83537418-2"

copyright = "KFTamang All rights reserved"

+++

# ビジュアルプログラミング言語processingをHUGOブログに埋め込む

processingとは視覚的表現などを簡単にできることを目指したC言語ライクなプログラミング言語です。
C言語などと異なり、描画のための関数などが最初から準備されており、プログラミングに詳しくないアーティストや
子供でも視覚的作品を作ることができます。

今回はprocessingのjavascript移植版であるp5.jsをHUGOブログに埋め込んで見たいと思います。

## ショートコード
静的サイトジェネレーターであるHUGOにはショートコードという機能があり、事前に設定したhtmlを任意の位置に展開することができます。
また、展開先にパラメータを渡すこともできます。
今回はこのショートコードを使ってp5.jsを実行する環境を作りました。

```p5js.html
<div class="p5js">
    <iframe srcdoc="  <head>
        <script src=&quot https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/p5.js&quot></script>
        <script src=&quot https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/addons/p5.sound.min.js&quot></script>
        <link rel=&quotstylesheet&quot type=&quottext/css&quot href=&quotstyle.css&quot>
        <meta charset=&quotutf-8&quot />
    
      </head>
      <body>
        <script src=&quot/p5js/{{.Get 0}}.js&quot></script>
      </body>"
      width="100%" height="400px"></iframe>
</div>

```

このショートコードは`iframe`に`srcdoc`でページの全体を文字列として渡しています。
パラメーターとしてファイル名を渡すことで、/p5jsディレクトリ以下のp5.jsファイルを実行できます。

## 使い方
使用しているテーマ内の`layouts/partilas/`に上記の`p5js.html`を配置します。
これでショートコードp5jsが定義され、使えるようになりました。

あとはブログの任意の個所で`"{ {< p5js (ファイル名).js >} }"`と記述すれば`/p5js`ディレクトリに配置されてある`(ファイル名).js`が実行されます。
(二つの`{`の間のスペースは削除してください。)
## 具体例

test.js
```test.js
function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.class('backgroundsketch');
}

function mouseMoved() {
	ellipse(mouseX, mouseY, 100, 100);
}
```


{{<p5js test>}}

## 参考文献
- p5.jsのサイトへの埋め込みかた [Embedding p5.js](https://github.com/processing/p5.js/wiki/Embedding-p5.js)
- p5.jsについて [From p5.js to Web Dev](https://happycoding.io/tutorials/p5js/web-dev)

- HUGOのショートコードの作り方 [Create Your Own Shortcodes - HUGO](https://gohugo.io/templates/shortcode-templates/)