+++
title = "p5.jsでマンデルブロー集合"
subtitle = ""
date = "2021-05-01T8:00:09+09:00"
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

## マンデルブロー集合

{{<p5js mandelbrot>}}

## コード

```mandelbrot.js
function setup(){
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.class('backgroundsketch');
    loadPixels();
    draw_mandelbrot();
}

function draw_mandelbrot(){
    for(var i=0;i<windowWidth;i++){
        for(var k=0;k<windowHeight;k++){
            const max = 100;
            let n = max;
            let _x = 4.0 * (i / windowWidth - 0.5);
            let _y = 4.0 * (k / windowHeight - 0.5);
            let a = 0.0;
            let b = 0.0;
            
            while(n > 0 && a*a + b*b < 2 ){
                let _a = a*a - b*b + _x;
                let _b = 2*a*b + _y;
                a = _a;
                b = _b;
                n--;
            }

            draw_pixel(i, k, n, max);
        }
    }
}

function draw_pixel(x, y, n, max){


    let d = pixelDensity();
    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          // loop over
          index = 4 * ((y * d + j) * width * d + (x * d + i));
          pixels[index+0] = n*255/max;
          pixels[index+1] = n*255/max;
          pixels[index+2] = n*255/max;
          pixels[index+3] = 255;
        }
    }
}

function draw(){
    updatePixels();
}
```

## 参考文献
- [マンデルブロー集合　-2次関数の複素力学系入門-](https://www1.econ.hit-u.ac.jp/kawahira/courses/mandel.pdf)
- [マンデルブロ集合 - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%B3%E3%83%87%E3%83%AB%E3%83%96%E3%83%AD%E9%9B%86%E5%90%88)
