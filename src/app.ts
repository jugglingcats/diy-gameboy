// for some reason this has to be at top of entry file (maybe to do with espruino constants?)
// export const flashHandler = new (require("./FlashEEPROM"))();
// flashHandler.endAddr = flashHandler.addr + 1024;
// export const flash = require("Flash");

import { MainMenu } from "./modules/MainMenu";
import { Button, Module, ButtonMode, Services } from "./modules/Module";
import { Highscores } from "./modules/Highscores";
import { Sound } from "./modules/Sound";
import { Pong } from "./modules/Pong";

declare const require: any;

require("./espruino");

const mainMenu = new MainMenu();
// let module: Module = mainMenu;
// let module:Module = new LunarLander();
// let module:Module = new FlappyBird();
let module:Module = new Pong();
// 
let count = 1;
function tick(services: Services) {
    const { buttons } = services; 

    if (count === 1) {
        console.log("Init first module");
        module.init(services);
    }

    const next = module.tick(services) || mainMenu;

    if (next.id != module.id) {
        console.log("Module changed to: ", next.id);
        // reset button modes
        buttons.forEach(b => b.setMode(ButtonMode.CLICK));

        next.init(services);
        module = next;
    }
    count++;
} 

export function start(services: Services) {
    setInterval(function () {
        tick(services);
    }, 50)
}
// 