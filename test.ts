console.log("Hello world 2");

declare const D2: any, D5: any, D13: any, D18: any, D22: any, D23: any, D25: any, D35: any;

declare const Graphics: any;
declare const SPID: any;

const PIN_NUM_MISO = D25
const PIN_NUM_MOSI = D23
const PIN_NUM_CLK = D18
const PIN_NUM_CS = D5

const PIN_NUM_DC = D2
const PIN_NUM_RST = D22

console.log("SPID init");
var spi = new SPID(20);
console.log("SPID init done");

var oled = Graphics.createArrayBuffer(128, 64, 1, { vertical_byte: true });
console.log("Graphics init done");

var x1 = 17;
var dx1 = 4;
var y1 = 5;
var dy1 = 4;
var x2 = 47;
var dx2 = 2;
var y2 = 31;
var dy2 = 2;

const NUM_RECTS = 1;
const rects = new Array(NUM_RECTS);
for (var n = 0; n < NUM_RECTS; n++) {
    rects[n] = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    };
}

var ridx = 0;

var n:number;

function xfer() {
    // while (true) {

    oled.clear();

    for (n=0; n< NUM_RECTS; n++) {
        var r=rects[n];
        oled.drawRect(r.x1, r.y1, r.x2, r.y2);
    }

    spi.send(oled.buffer);

    x1 += dx1;
    x2 += dx2;
    y1 += dy1;
    y2 += dy2;

    if (x1 < 2 || x1 > 126) {
        dx1 = -dx1;
    }
    if (x2 < 2 || x2 > 126) {
        dx2 = -dx2;
    }
    if (y1 < 2 || y1 > 62) {
        dy1 = -dy1;
    }
    if (y2 < 2 || y2 > 62) {
        dy2 = -dy2;
    }

    rects[ridx].x1 = x1;
    rects[ridx].y1 = y1;
    rects[ridx].x2 = x2;
    rects[ridx].y2 = y2;

    ridx = (ridx + 1) % NUM_RECTS;

    // }
}

setInterval(xfer, 0);
