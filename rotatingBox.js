function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES)
  fullscreen()
  print("Press space to double jump")
}
let oc;
function preload(){ 
  oc = loadModel('beach.obj')
}



var friction = 50
var groundHeight = 25
var boxSpeed = 5
var boxRotationSpeed = 3
var cameraHeight = 200;
var cameraDistance = 300;
var boxX = 10;
var boxXMomentum = 0;

var boxY = 0;
var boxYMomentum = 0;

var boxZ = 25;
var boxZMomentum = 0;


var boxXRotation = 0;
var boxYRotation = 0;
var boxRotation = 0;
var trueRotation = 0;
var gravity = 0.5;
var jumpStrength = 10;
var onGround = true;
var doubleJump = true;
var lastJumped = 0;
var boxRotationMomentum = 0;
var rotationSlowSpeed = 0.05;
var sideFlipStrength = 2;

var sideFlip = false;
var sideFlipDirection = 0;
var frontFlip = false;
var backFlip = false;



function keyPressed(){
    if (keyCode == 32 && onGround == false && doubleJump == true){
      if (keyIsDown(65)){
        
        // Left flip
        sideFlip = true;
        sideFlipDirection = 1;
        boxRotationMomentum = 0;
        boxXMomentum += boxSpeed * sideFlipStrength * cos(trueRotation + 90);
        boxYMomentum += boxSpeed * sideFlipStrength * sin(trueRotation + 90);
      } else if (keyIsDown(68)){
        
        // Right flip
        sideFlip = true;
        sideFlipDirection = -1;
        boxRotationMomentum = 0;
        boxXMomentum -= boxSpeed * sideFlipStrength * cos(trueRotation + 90);
        boxYMomentum -= boxSpeed * sideFlipStrength * sin(trueRotation + 90);
      }
      if (keyIsDown(87)){
        // Front flip
        frontFlip = true;
        boxRotationMomentum = 0;
        boxXMomentum -= boxSpeed * sideFlipStrength * cos(trueRotation);
        boxYMomentum -= boxSpeed * sideFlipStrength * sin(trueRotation);
      } else if (keyIsDown(83)){
        // back flip
        backFlip = true;
        boxRotationMomentum = 0;
        boxXMomentum += boxSpeed * sideFlipStrength * cos(trueRotation);
        boxYMomentum += boxSpeed * sideFlipStrength * sin(trueRotation);
      }
      
      boxZMomentum /= 3;
      boxZMomentum += jumpStrength;
      doubleJump = false
    }
}


function draw() {
  background(200, 200, 200);
  
  // Key binds
  if (keyIsDown(65) && onGround == true) {
    
    // A rotates left
    boxRotation -= boxRotationSpeed
    trueRotation -= boxRotationSpeed
  } else if (keyIsDown(68) && onGround == true){
    // D rotates right
    boxRotation += boxRotationSpeed
    trueRotation += boxRotationSpeed
  }
  if (keyIsDown(87) && onGround == true) {
    // Moving Forward
    boxX -= boxSpeed * cos(trueRotation)
    boxY -= boxSpeed * sin(trueRotation)
  } else if (keyIsDown(83) && onGround == true){
    // Moving Backwards
    boxX += boxSpeed * cos(trueRotation)
    boxY += boxSpeed * sin(trueRotation)
  }
  
  // Jumping with Space
  if (keyIsDown(32) && boxZ <= groundHeight){
    if (keyIsDown(65)){
      boxRotationMomentum = -boxRotationSpeed
    } else if (keyIsDown(68)){
      boxRotationMomentum = boxRotationSpeed
    }
    if (keyIsDown(87)){
      boxXMomentum = -boxSpeed * cos(trueRotation)
      boxYMomentum = -boxSpeed * sin(trueRotation)
    }
    if (keyIsDown(83)){
      boxXMomentum = boxSpeed * cos(trueRotation)
      boxYMomentum = boxSpeed * sin(trueRotation)
    }
    boxZMomentum = jumpStrength
    boxZ = groundHeight + 1
    onGround = false
    lastJumped = 0
    
  }
  
  
  
  // AIR
  if (onGround == false){
    // Keeps rotation in air
    if (boxRotationMomentum > boxRotationSpeed/4){
      boxRotationMomentum -= rotationSlowSpeed
    }
    boxRotation += boxRotationMomentum
    trueRotation += boxRotationMomentum
    // Air Rotation
    if (boxXMomentum > 0){
      boxYMomentum -= 0.05
    } else{
      boxXMomentum += 0.05
    }
    if (boxYMomentum > 0){
      boxYMomentum -= 0.05
    } else{
      boxYMomentum += 0.05
    }
    boxX += boxXMomentum
    boxY += boxYMomentum 
    
    
    // Air flips
    if (sideFlip == true){
      boxXRotation += 3 * sideFlipDirection * sin(trueRotation-90-boxRotation)
      boxYRotation += 3 * sideFlipDirection * cos(trueRotation-90-boxRotation)
    }
    if (frontFlip == true){
      boxXRotation -= 3 * sin(trueRotation-boxRotation)
      boxYRotation -= 3 * cos(trueRotation-boxRotation)
    }
    if (backFlip == true){
      boxXRotation += 3 * sin(trueRotation-boxRotation)
      boxYRotation += 3 * cos(trueRotation-boxRotation)
    }
  }
  
  
  
  // CAMERA
  // Preventing boxRotation from getting too big
  if (round(boxRotation) == 360) {
    boxRotation = 0;  
  }
  plane(400, 400)
  // Camera rotates with box
  camera(boxX + cameraDistance * (cos(trueRotation)), boxY + cameraDistance *(sin(trueRotation)), boxZ + cameraHeight, boxX, boxY, boxZ, 0, 0, -1);

    
    
  // LANDING
  if (boxZ + boxZMomentum < groundHeight){
    // Runs when landed
    // If boxZ would go under groundHeight next frame, it sets it to 0
    boxXMomentum = 0
    boxYMomentum = 0
    boxXRotation = 0
    boxYRotation = 0
    boxZ = groundHeight
    onGround = true
    doubleJump = true
    sideFlip = false
    frontFlip = false
    backFlip = false
    sideFlipDirection = 0
    boxRotationMomentum = 0
  } else if (boxZ > groundHeight){
    // 
    boxZ += boxZMomentum
    boxZMomentum -= gravity
  }
  
  // Lateral Momentun
  
  // Incerases the ocelation and makes it start to look 3D
  translate(boxX, boxY, boxZ);
  rotateZ(boxRotation);
  rotateX(boxXRotation);
  rotateY(boxYRotation);
  box(50);
  scale(5)
  //model(oc)
  rotateX(-boxXRotation);
  rotateY(-boxYRotation);
  rotateZ(-boxRotation);
  //plane(50);
  
}
