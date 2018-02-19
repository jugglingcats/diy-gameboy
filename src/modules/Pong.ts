import { Module, Button, ButtonMode } from "./Module";
import { GetReadyScreen, GameOverScreen } from "./sharedScreens";

let pos = 35;
let bx = 10;
let by = 0;
let bdx = 1;
let bdy = 1;
let score = 0;

const w = 10;

export class Pong implements Module {
    restart: GetReadyScreen;
    id: string = "Pong";

    constructor() {
        this.restart = new GetReadyScreen(this);
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        g.clear();
        g.drawRect(pos, 46, pos + w, 47);
        g.drawRect(bx, by, bx + 3, by + 3);
        g.flip();

        if (bx + bdx > 77 || bx + bdx < 0) {
            bdx = -bdx;
        }
        if (by + bdy < 0) {
            bdx += (Math.random() - 0.5) / 5;
            bdy = -bdy;
        }
        if (by + bdy > 43) {
            if (bx < pos - 1 || bx > pos + w) {
                return new GameOverScreen(this.restart, this.id, score);;
            }
            score++;
            if (score % 5 == 0) {
                bdy *= 1.1;
            }
            bdx = (bx - pos - w / 2) / 2;
            // console.log("bx=", bx, ", pos=", pos, ", w=", w, "new bdx=", bdx);
            bdy = -bdy;
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

    init(g: any, buttons: Button[]): void {
        console.log("Pong init");
        buttons[0].setMode(ButtonMode.PRESS);
        buttons[2].setMode(ButtonMode.PRESS);

        bx = Math.round(Math.random() * 80);
        by = 0;
        bdx = 1;
        bdy = 1;
        score = 0;
    }
}