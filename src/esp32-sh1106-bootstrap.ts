import { Button } from "./modules/Module";
import { Sound } from "./modules/Sound";
import { Highscores } from "./modules/Highscores";

declare const D2: any, D5: any, D13: any, D18: any, D21: any, D22: any, D23: any, D25: any, D35: any;

const PIN_NUM_MOSI = D23
const PIN_NUM_CLK = D18
const PIN_NUM_CS = D5

const PIN_NUM_DC = D2
const PIN_NUM_RST = D22

declare const Graphics: any;
declare const SPID: any;

const dummyFlash = {
    read: function () { return "" },
    erase: function () { },
    get: function () { return 0 },
    put: function () { },
    write: function () { },
    cleanup: function () { }
} 

var initCmds = E.toString(new Uint8Array([0xAE, // 0 disp off
    0xD5,  // 1 clk div
    0x50,  // 2 suggested ratio
    0xA8, 63, // 3 set multiplex
    0xD3, 0x0, // 5 display offset
    0x40,  // 7 start line
    0xAD, 0x8B, // 8 enable charge pump
    0xA1,  // 10 seg remap 1, pin header at the top
    0xC8,  // 11 comscandec, pin header at the top
    0xDA, 0x12, // 12 set compins
    0x81, 0x80, // 14 set contrast
    0xD9, 0x22, // 16 set precharge
    0xDB, 0x35, // 18 set vcom detect
    0xA6,  // 20 display normal (non-inverted)
    0xAF, // 21 disp on
]));

var pageCmds = E.toString(new Uint8Array([
    0xB0, 0x02, 0x10,
    0xB1, 0x02, 0x10,
    0xB2, 0x02, 0x10,
    0xB3, 0x02, 0x10,
    0xB4, 0x02, 0x10,
    0xB5, 0x02, 0x10,
    0xB6, 0x02, 0x10,
    0xB7, 0x02, 0x10,
]));

export function run(flashHandler: any = dummyFlash) {
    console.log("SPID init");
    var spi = new SPID(20);
    spi.init_display(128, 8);
    spi.send_raw(initCmds, 0);
    console.log("SPID init done");

    var graphics = Graphics.createArrayBuffer(128, 64, 1, { vertical_byte: true });
    console.log("Graphics init done");

    graphics.flip = function () {
        spi.flip(graphics.buffer, false, pageCmds);
    }

    const buttons: Button[] = [
        new Button(D35, "Green"),
        new Button(D25, "Red"),
        new Button(D13, "Yellow")
    ]

    const sound = new Sound(D21);
    sound.playTune(Sound.tunes.welcome);

    const highscores = new Highscores(flashHandler);

    require("./app").start({
        graphics: graphics,
        buttons: buttons,
        highscores: highscores,
        sound: sound
    });

    console.log("Bootstrap done");
}
