function setup() {
  createCanvas(400, 400);
}
var bg
var mouseTime
function draw() {
  noStroke();
  function mousePressed(){
    mouseTime = 500
  }
  mouseTime --
  if(mouseIsPressed === true){
    round(mouseX)
    fill(255, mouseTime)
    circle(mouseX, mouseY, 50)
  }
  
  
}
