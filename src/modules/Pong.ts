import { Module, Button, ButtonMode, Services } from "./Module";
import { GetReadyScreen, GameOverScreen } from "./sharedScreens";

let pos = 35;
let bx = 10;
let by = 0;
let bdx = 1;
let bdy = 1;
let score = 0;

const w = 10;
const blocks = new Array(10);
const bl_rows = 2;
const bl_cols = blocks.length / bl_rows;
const bl_width = 10;
const bl_height = 5;

export class Pong implements Module {
    restart: GetReadyScreen;
    id: string = "Pong";

    constructor() {
        this.restart = new GetReadyScreen(this);
    }

    tick(services: Services): Module | undefined {
        const { graphics: g, buttons, highscores } = services;
        g.clear();
        for (var n = 0; n < blocks.length; n++) {
            if (blocks[n][0] >= 0) {
                g.drawRect(blocks[n][0], blocks[n][1], blocks[n][0] + bl_width, blocks[n][1] + bl_height);
            }
        }
        g.drawRect(0, 0, g.getWidth() - 1, g.getHeight());
        g.drawRect(pos, g.getHeight() - 2, pos + w, g.getHeight() - 1);
        g.drawRect(bx, by, bx + 2, by + 2);
        g.flip();

        if (by + bdy > g.getHeight() - 4) {
            if (bx < pos - 1 || bx > pos + w) {
                return new GameOverScreen(this.restart, this.id, score, highscores);
            }
            score++;
            if (score % 5 == 0) {
                bdy *= 1.1;
            }
            bdx = (bx - pos - w / 2) / 2;
            bdy = -bdy;
        }

        if (bx + bdx > g.getWidth() - 3 || bx + bdx < 0) {
            bdx = -bdx;
        }
        if (by + bdy < 0) {
            bdx += (Math.random() - 0.5) / 5;
            bdy = -bdy;
        }

        for (var n = 0; n < blocks.length; n++) {
            if (blocks[n][0] >= 0 && bx > blocks[n][0] - 1 && bx < blocks[n][0] + bl_width + 1 && by > blocks[n][1] && by < blocks[n][1] + bl_height+2) { 
                const x1 = bx - blocks[n][0];
                const x2 = blocks[n][0] + bl_width - bx;
                const y1 = by - blocks[n][1];
                const y2 = blocks[n][1] + bl_height - by;

                const mx = Math.min(x1, x2);
                const my = Math.min(y1, y2);
                if (mx < my) {
                    bdx = -bdx;
                } else {
                    bdy = -bdy;
                }
                blocks[n][0] = -1;
            }
        }

        bx += bdx;
        by += bdy;

        if (buttons[0].pressed()) {
            pos -= 2;
        }
        if (buttons[2].pressed()) {
            pos += 2;
        }
        return this;
    }

    init(services: Services): void {
        const { graphics: g, buttons } = services;
        console.log("Pong init");
        buttons[0].setMode(ButtonMode.PRESS);
        buttons[2].setMode(ButtonMode.PRESS);

        bx = 65;// Math.round(Math.random() * 80);
        by = g.getHeight() / 2 + 20;
        bdx = 0;
        bdy = -1;
        score = 0;

        let count = 0;
        for (var x = 0; x < bl_cols; x++) {
            for (var y = 0; y < bl_rows; y++) {
                const px = g.getWidth() / (bl_cols + 1) * (x + 0.75);
                const py = 10 + 15 * y;
                blocks[count++] = [px, py];
            }
        }
    }
}