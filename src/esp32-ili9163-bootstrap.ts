import { Button } from "./modules/Module";

declare const D2: any, D5: any, D13: any, D18: any, D22: any, D23: any, D25: any, D35: any;

declare const digitalPulse: Function;

const PIN_NUM_MOSI = D23
const PIN_NUM_CLK = D18
const PIN_NUM_CS = D5

const PIN_NUM_DC = D2
const PIN_NUM_RST = D22

declare const Graphics: any;
declare const SPID: any;

const LCD_WIDTH = 128;
const LCD_HEIGHT = 128;
// 
var wakeupCmds = E.toString(new Uint8Array([
    0x11, 0
]));

var initCmds = new Uint8Array([
    0x26, 1, 0x04, //Set Default Gamma
    0xB1, 2, 0x0e, 0x10, //Set Frame Rate
    0xC0, 2, 0x08, 0, //Set VRH1[4:0] & VC[2:0] for VCI1 & GVDD
    0xC1, 1, 0x05, //Set BT[2:0] for AVDD & VCL & VGH & VGL
    0xC5, 2, 0x38, 0x40, //Set VMH[6:0] & VML[6:0] for VOMH & VCOML

    0x3a, 1, 5, //Set Color Format, 5=16 bit,3=12 bit
    0x36, 1, 0xc8, //RGB

    0xB4, 1, 0, // display inversion

    0xf2, 1, 1, //Enable Gamma bit
    0xE0, 15, 0x3f, 0x22, 0x20, 0x30, 0x29, 0x0c, 0x4e, 0xb7, 0x3c, 0x19, 0x22, 0x1e, 0x02, 0x01, 0x00,
    0xE1, 15, 0x00, 0x1b, 0x1f, 0x0f, 0x16, 0x13, 0x31, 0x84, 0x43, 0x06, 0x1d, 0x21, 0x3d, 0x3e, 0x3f,

    0x29, 0, // Display On
    0x2C, 0 // reset frame ptr      
]);

const paintAreaCmds = E.toString([
    0x2a, 4, 0, 2, 0, LCD_WIDTH + 1,
    0x2b, 4, 0, 3, 0, LCD_HEIGHT + 2,
    0x2c
]);
// 
const SIZE = LCD_WIDTH * LCD_HEIGHT * 16 / 8;

export function run() {
    digitalPulse(PIN_NUM_RST, 0, 3);

    setTimeout(function () {
        var spi = new SPID(20);
        spi.init_display(128, SIZE / 128);

        spi.send_cmds(wakeupCmds);
        setTimeout(function () {
            spi.send_cmds(initCmds);
            spi.send_cmds(paintAreaCmds);

            var graphics = Graphics.createArrayBuffer(LCD_WIDTH, LCD_HEIGHT, 16);

            graphics.flip = function () {
                spi.flip(graphics.buffer, true);
            }

            const buttons: Button[] = [
                new Button(D35, "Green"),
                new Button(D25, "Red"),
                new Button(D13, "Yellow")
            ]

            require("./app").start(graphics, buttons);

            console.log("Bootstrap done");

            // graphics.clear();
            // graphics.fillRect(0, 0, 10, 10);

            // console.log("Filled rect, about to flip");

            // graphics.flip();
        }, 50);
    }, 100);
}
