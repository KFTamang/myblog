function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.class('backgroundsketch');
}

function mouseMoved() {
	ellipse(mouseX, mouseY, 100, 100);
}