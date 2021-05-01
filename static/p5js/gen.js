function Lorenz(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.dt = 0.01;
    
    this.coef1 = 10 + random(-1,1);
    console.log(this.coef1);
    this.coef2 = 28;
    this.coef3 = 8/3 + random(-0.1, 0.1);
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
        fill(color(this.x*8 + this.pos + 50, this.y*10 + 255 - this.pos + 5, this.z*10  + 255 -  this.pos + 5));
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

    }
}

let l = [];

function setup(){
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.class('backgroundsketch');
    for(var i=0;i<100;i++){
        l[i] = new Lorenz(i, 10.0-i, 10.0+i/10);

    }
}


function draw(){
    for(var i=0;i<100;i++){
        l[i].update();
        l[i].show();
    }    
}