import { Module, Button, ButtonMode, Services } from "../Module";
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
    background: ArrayBuffer | undefined;

    constructor() {
        this.restart = new GetReadyScreen(this);
    }

    tick(services: Services): Module | undefined {
        const { graphics: g, buttons, highscores } = services;
        if (landed) {
            g.drawImage(flag, landerx + landerw + 2, landscape[Math.round(landerx) + landerw + 2] - flagh);
            g.drawString("Touchdown!", g.getWidth() / 2 - g.stringWidth("Touchdown!") / 2, 8);

            if (pause++ > 20) {
                g.drawString("GREEN - next", g.getWidth() / 2 - g.stringWidth("GREEN - next") / 2, 18);
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
        new Uint8Array(g.buffer).set(new Uint8Array(this.background!));

        if (!crashed) {
            if (hit_terrain()) {
                if (landerx < padx || landerx + landerw > padx + padw + 2) {
                    crashed = true;
                    reason = "Missed Pad!"
                } else if (landervy > 2) {
                    reason = "Too Fast!"
                    crashed = true;
                } else {
                    landery = g.getHeight() - 2 - landerh
                    landed = true;
                    score++;
                }
            }

            g.drawImage(landerBody, landerx, landery);
        } else {
            g.drawString(reason, g.getWidth() / 2 - g.stringWidth(reason) / 2, 8);
            if (!this.particles) {
                this.particles = new Particles(Math.round(landerx), Math.round(landery), landscape);
            }
            if (!this.particles.draw(g)) {
                const score1 = score;
                score = 0;
                return new GameOverScreen(this.restart, this.id, score1, highscores);
            }
        }

        if (buttons[1].pressed()) {
            g.drawImage(landerJet, landerx, landery + landerh + 1);
        }

        g.drawRect(padx, g.getHeight() - 1, padx + padw, g.getHeight() - 1);

        g.flip();

        return this;
    }

    init(services: Services): void {
        const { graphics: g, buttons } = services;
        console.log("Lunar Lander Game start");

        // generate new landscape
        landscape = [];
        padx = Math.floor(Math.random() * (g.getWidth() - 30)) + 15;

        for (let n = 0; n <= padw + 2; n++) {
            landscape.push(g.getHeight() - 2);
        }

        const right_terrain = terrain_gen(g.getWidth() - padx - padw, g.getHeight());
        landscape = landscape.concat(right_terrain);

        const left_terrain = terrain_gen(padx - 1, g.getHeight()).reverse();
        landscape = left_terrain.concat(landscape);

        // draw the landscape into the (fixed) background
        if (!this.background) {
            // create buffer same size as graphics
            this.background = new ArrayBuffer(g.buffer.length);
        }
        g.clear();
        for (var l = 0; l < landscape.length; l++) {
            g.setPixel(l, landscape[l]);
        }
        new Uint8Array(this.background).set(new Uint8Array(g.buffer));

        // setup the buttons
        buttons[0].setMode(ButtonMode.PRESS);
        buttons[1].setMode(ButtonMode.PRESS);
        buttons[2].setMode(ButtonMode.PRESS);

        // position the lander
        landery = 0;
        landervy = 0;

        landerx = Math.random() * (g.getWidth() - 20) + 10;
        landervx = 0;

        landed = false;
        crashed = false;
        this.particles = undefined;
    }
}
