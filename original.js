A5.write(0); // GND
A7.write(1); // VCC

pinMode(B3, 'input_pulldown');
pinMode(B4, 'input_pulldown');
pinMode(B7, 'input_pulldown');

var btn1, btn2, btn3;

setWatch(function(e) {
  console.log("Button 1 pressed");
  btn1=true;
}, B3, { repeat: true, edge: 'rising', debounce: 50 });

setWatch(function(e) {
  console.log("Button 2 pressed");
  btn2=true;
}, B4, { repeat: true, edge: 'rising', debounce: 50 });

setWatch(function(e) {
  console.log("Button 3 pressed");
  btn3=true;
}, B7, { repeat: true, edge: 'rising', debounce: 50 });

var SPEED=0.5;

var img = {
  width : 8, height : 8, bpp : 1,
  transparent : 0,
  buffer : new Uint8Array([
    0b01111110,
    0b10000001,
    0b10100101,
    0b10000001,
    0b10111101,
    0b10011001,
    0b10000001,
    0b01111110,
  ]).buffer
};

var g;
var birdy = 48/2;
var birdvy = 0;
var wasPressed = false;

var running=true;
var score=0;
var barriers = [];

function newbarrier(x) {
  barriers.push({
    x1 : x-5,
    x2 : x+5,
    y : 10+Math.random()*28,
    gap : 12
  });
}

function gameStart() {
  barriers = [];
  newbarrier(42);
  newbarrier(84);
  birdy = 48/2;
  birdvy = 0;
  score=0;
  SPEED=0.5;
  running=true;
}

function gameStop() {
  running=false;
}

function draw() {
  g.clear();

  if ( !running ) {
    g.setFontVector(8);
    g.drawString("Game Over!", 40-g.stringWidth("Game Over!")/2, 10);
    g.setFontBitmap();
    g.drawString("Score "+score, 25, 25);
    g.flip();
    if ( btn1 ) {
      gameStart();
    }
    return;
  }
  
  score++;
  
  if ( score > 100 && score % 200 < 10 ) {
    g.drawString("Level Up!", 25, 20);
    SPEED+=0.05;
  }
  
  if (btn2)
    birdvy -= 2.5;

  birdvy += 0.25;
  birdvy *= 0.95;
  birdy += birdvy;
  g.drawImage(img, 0, birdy-4);
  if ( birdy > g.getHeight() ) {
    running=false;
  }
  
  barriers.forEach(function(b) {
    b.x1-=SPEED;
    b.x2-=SPEED;
    var btop=b.y-b.gap;
    var bbot=b.y+b.gap;
    g.drawRect(b.x1+1, -1, b.x2-2, btop-5);
    g.drawRect(b.x1, btop-5, b.x2, btop);
    g.drawRect(b.x1, bbot, b.x2, bbot+5);
    g.drawRect(b.x1+1, bbot+5, b.x2-1, g.getHeight());
  
    if ( b.x1 < 8 && (birdy-3 < btop || birdy+3 > bbot) ) {
      running=false;
    }
  });

  while (barriers.length && barriers[0].x2 <= 0) {
    barriers.shift();
    newbarrier(84);
  }
  
  g.flip();
  // reset the buttons
  btn1=false;
  btn2=false;
  btn3=false;
}
// 

function onInit() {
  // Setup SPI
  var spi = new SPI();
  spi.setup({ sck:B1, mosi:B10 });
  // Initialise the LCD
  // g = require("PCD8544").connect(spi,B13,B14,B15, function() {
  //   // When it's initialised, set up an animation at 20fps (50ms per frame)
  //   gameStart();
  //   setInterval(draw, 50);
  // });
}