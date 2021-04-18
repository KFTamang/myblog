function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.class('backgroundsketch');
}

function draw() {
  	// ellipse(50, 50, 80, 80);
}

function mouseMoved() {
	ellipse(mouseX, mouseY, 50, 10);
}