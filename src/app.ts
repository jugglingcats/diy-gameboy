// for some reason this has to be at top of entry file (maybe to do with espruino constants?)
export const flashHandler=new (require("./FlashEEPROM"))();

import { MainMenu } from "./modules/MainMenu";
import { Button, Module, ButtonMode } from "./modules/Module";
import { LunarLander } from "./modules/lander/LunarLander";
import { ExplosionDemo } from "./modules/lander/Explosion";

declare const require:any;

export const PCD8544 = require("PCD8544");

require("./espruino");

A5.write(0); // GND
A7.write(1); // VCC

let module:Module = new MainMenu();
// let module:Module = new LunarLander();
// let module:Module = new ExplosionDemo();

const buttons = [
    new Button(B3, "Green"),
    new Button(B4, "Red"),
    new Button(B7, "Yellow")
]

let count=1;
function tick(g: any) {
    if ( count === 1 ) {
        module.init(g, buttons);
    }

    const next = module.tick(g, buttons) || new MainMenu();
    // console.log(next.id, count++);
    if ( next.id != module.id ) {
        console.log("Module changed to: ", next.id);
        // reset button modes
        buttons.forEach(b => b.setMode(ButtonMode.CLICK));

        next.init(g, buttons);
        module=next;
    }
    count++;
}

export function start() {
    setTimeout(() => {
        // Setup SPI
        var spi = new SPI();
        spi.setup({ sck: B1, mosi: B10 });
        // Initialise the LCD
        const g = PCD8544.connect(spi, B13, B14, B15, function () {
            // When it's initialised, set up an animation at 20fps (50ms per frame)
            //   gameStart();
            setInterval(function () {
                tick(g);
            }, 50);
            console.log("Ready!");
        });
    }, 1000);
}
