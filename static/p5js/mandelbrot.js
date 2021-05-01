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