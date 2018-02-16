import { Module, Button, ButtonMode } from "../Module";
import { GameOverScreen, GetReadyScreen } from "../sharedScreens";
import { landerw, landerh, flag, flagh, landerBody, landerJet } from "./landerGraphics";
import { terrain_gen } from "./terrainGen";
import { Particles } from "./Explosion";

let landery = 0;
let landervy = 0;

let landerx = 30;
let landervx = 0;

let landed = false;
let crashed = false;
let reason;

let landscape: number[] = [];

let padx = 0;
let padw = 15;

let score = 0;

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
    particles: Particles | undefined = undefined;
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
            // landerx--;
            landervx -= 0.1;
        }
        if (buttons[2].pressed()) {
            // landerx++;
            landervx += 0.1;
        }

        g.clear();

        if ( !crashed) {
            if (hit_terrain()) {
                if (landerx < padx || landerx + landerw > padx + padw + 2) {
                    crashed = true;
                    reason="Missed Pad!"
                } else if (landervy > 2) {
                    reason="Too Fast!"
                    crashed = true;
                } else {
                    landery = 46 - landerh
                    landed = true;
                    score++;
                }
            }
    
            g.drawImage(landerBody, landerx, landery);
        } else {
            g.drawString(reason, 40 - g.stringWidth(reason) / 2, 8);
            if (!this.particles) {
                this.particles = new Particles(Math.round(landerx), Math.round(landery), landscape);
            }
            if (!this.particles.draw(g)) {
                const score1=score;
                score=0;
                return new GameOverScreen(this.restart, this.id, score1);
            }
        }

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
        crashed=false;
        this.particles=undefined;
    }

}
