import { Module, Button, ButtonMode } from "./Module";
import { GameOverScreen, GetReadyScreen } from "./sharedScreens";

let landery = 0;
let landervy = 0;

let landerx = 30;
let landervx = 0;

let landed = false;

let landscape: number[] = [];

let padx = 0;
let padw = 12;

let score = 0;

const flagw = 8;
const flagh = 8;
let flag = {
    width: flagw, height: flagh, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b01111110,
        0b01000010,
        0b01000010,
        0b01111110,
        0b01000000,
        0b01000000,
        0b01000000,
        0b01000000,
    ]).buffer
};

const landerw = 8;
const landerh = 8;
let landerBody = {
    width: landerw, height: landerh, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b00011000,
        0b00100100,
        0b01000010,
        0b01011010,
        0b01000010,
        0b01011010,
        0b10000001,
        0b11111111,
    ]).buffer
};

let landerJet = {
    width: 8, height: 4, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b10000001,
        0b01000010,
        0b00100100,
        0b00011000,
    ]).buffer
};

function terrain_gen(count: number): number[] {
    let y = 46;
    let change = 0;
    let repeat = 4;
    const result: number[] = [];
    for (let n = 0; n < count; n++) {
        if (change == 0) {
            if (Math.random() < 0.7) {
                change = -1;
            } else {
                change = +1;
            }
        }
        y += change;
        if (y > 47) {
            y = 47;
        }
        repeat--;
        if (repeat == 0) {
            change = 0;
            repeat = Math.round(Math.random() * 2 + 1);
        }
        result.push(y);
    }
    return result;
}

function hit_terrain(): boolean {
    const x = Math.floor(landerx);
    for (let j = x; j < x + landerw - 1; j++) {
        if (Math.floor(landery) + landerh > landscape[j]) {
            return true;
        }
    }
    return false;
}

let pause = 0;

export class LunarLander implements Module {
    restart: GetReadyScreen;
    id: string = "LunarLander";

    constructor() {
        this.restart = new GetReadyScreen(this);

        landscape = [];

        padx = Math.floor(Math.random() * 40) + 15;

        for (let n = 0; n <= padw + 2; n++) {
            landscape.push(46);
        }

        const right_terrain = terrain_gen(80 - padx - padw);
        landscape = landscape.concat(right_terrain);

        const left_terrain = terrain_gen(padx - 1).reverse();
        landscape = left_terrain.concat(landscape);
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        if (landed) {
            g.drawImage(flag, landerx + landerw + 2, landscape[Math.round(landerx) + landerw + 2] - flagh);
            g.drawString("Touchdown!", 40 - g.stringWidth("Touchdown!") / 2, 8);

            if (pause++ > 20) {
                g.drawString("GREEN - next", 40 - g.stringWidth("GREEN - next") / 2, 18);
                if (buttons[0].pressed()) {
                    pause = 0;
                    return this.restart;
                }
            }

            g.flip();
            return this;
        }

        landervy += 0.25;
        landervy *= 0.95;
        landery += landervy;

        if (buttons[1].pressed()) {
            landervy -= 0.5;
        }

        landerx += landervx;
        if (buttons[0].pressed()) {
            landervx -= 0.1;
        }
        if (buttons[2].pressed()) {
            landervx += 0.1;
        }

        if (hit_terrain()) {
            const score1 = score;
            if (landerx < padx || landerx + 8 > padx + padw) {
                score = 0;
                return new GameOverScreen(this.restart, score1);
            }
            if (landervy > 2) {
                score = 0;
                return new GameOverScreen(this.restart, score1);
            }
            landery = 46 - landerh
            landed = true;
            score++;
        }

        g.clear();

        g.drawImage(landerBody, landerx, landery);

        if (buttons[1].pressed()) {
            g.drawImage(landerJet, landerx, landery + landerh + 1);
        }

        landscape.forEach((y, x) => {
            g.drawRect(x, y, x, y);
        });
        g.drawRect(padx, 47, padx + padw, 47);

        g.flip();

        return this;
    }

    init(g: any, buttons: Button[]): void {
        console.log("Lunar Lander Game start");

        buttons[0].setMode(ButtonMode.PRESS);
        buttons[1].setMode(ButtonMode.PRESS);
        buttons[2].setMode(ButtonMode.PRESS);

        landery = 0;
        landervy = 0;

        landerx = Math.random() * 72;
        landervx = 0;

        landed = false;
    }

}
