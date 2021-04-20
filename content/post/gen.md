+++
title = "p5.jsでジェネレーティブアート：ローレンツアトラクタ"
subtitle = ""
date = "2021-04-20T22:00:09+09:00"
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
# ジェネレーティブアートを試してみる

先日の記事でp5.jsをブログで使えるようにしてみたので、カオス系のモデルとして有名なローレンツモデルを少しいじって
ジェネレーティブアートっぽくしてみる。

ローレンツモデルについてはググって出てくる以下を参照した。
- [ローレンツモデルにおけるカオスの定量的解析](http://hatano-lab.iis.u-tokyo.ac.jp/thesis/soturon2000/soturon_fujibuchi.pdf)
- [ローレンツ・カオスの理解の仕方](https://www.metsoc.jp/tenki/pdf/2014/2014_03_0075.pdf)


## ローレンツアトラクタ

{{<p5js gen>}}

## コード

```lorenz.js

function Lorenz(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.dt = 0.01;
    
    this.coef1 = 10;
    this.coef2 = 28;
    this.coef3 = 8/3;
    this.pos = 0;
    this.size = 5;
    this.centerx = 300;
    this.centery = 200;
    this.mode = 1;
    this.update = function(){
        this.x += this.dt*(this.y*this.coef1 - this.x*this.coef1);
        this.y += this.dt*(-this.x*this.z + this.x*this.coef2 - this.y);
        this.z += this.dt*(this.x*this.y - this.z*this.coef3);
        this.coef2 += 0.001;
        if(this.coef2 > 130){
            this.coef2 = 28
        }
    }

    this.show = function(){
        noStroke();
        fill(color(this.x*10 + this.pos + 50, this.y*10 + this.pos + 5, this.z*10 + this.pos + 5));
        ellipse(this.x*20 + this.centerx, this.y*10 + this.centery, this.z/10, this.z/10);
        if(this.mode){
            this.pos += 0.1;
            if(this.pos>255){
                this.mode = 0;
            }
        }else{
            this.pos -= 0.1;
            if(this.pos<1){
                this.mode = 1;
            }
        }

        console.log(this.pos);
    }
}

let l = [];

function setup(){
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.class('backgroundsketch');
    for(var i=0;i<50;i++){
        l[i] = new Lorenz(i, 10.0-i, 10.0+i/10);

    }
}


function draw(){
    for(var i=0;i<50;i++){
        l[i].update();
        l[i].show();
    }    
}
```

