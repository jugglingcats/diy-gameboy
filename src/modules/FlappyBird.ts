import { Module, Button } from "./Module";
import { GameOverScreen, GetReadyScreen } from "./sharedScreens";

let SPEED = 0.5;

let birdImg = {
    width: 8, height: 8, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b01111110,
        0b10000001,
        0b10100101,
        0b10000001,
        0b10111101,
        0b10011001,
        0b10000001,
        0b01111110,
    ]).buffer
};

var birdy = 48 / 2;
var birdvy = 0;

var score = 0;
var barriers: any[] = [];

function newbarrier(x: any) {
    barriers.push({
        x1: x - 5,
        x2: x + 5,
        y: 10 + Math.random() * 28,
        gap: 12
    });
}

export class FlappyBird implements Module {
    public id: string = "FlappyBird";
    restart: GetReadyScreen;

    constructor() {
        this.restart=new GetReadyScreen(this);
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        g.clear();

        const btn = buttons[1].pressed();

        score++;

        if (score > 100 && score % 200 < 10) {
            g.drawString("Level Up!", 25, 20);
            SPEED += 0.05;
        }

        if (btn)
            birdvy -= 2.5;

        birdvy += 0.25;
        birdvy *= 0.95;
        birdy += birdvy;
        g.drawImage(birdImg, 0, birdy - 4);
        if (birdy > g.getHeight()) {
            return new GameOverScreen(this.restart, score);
        }

        const hit=barriers.some((b: any) => {
            b.x1 -= SPEED;
            b.x2 -= SPEED;
            var btop = b.y - b.gap;
            var bbot = b.y + b.gap;
            g.drawRect(b.x1 + 1, -1, b.x2 - 2, btop - 5);
            g.drawRect(b.x1, btop - 5, b.x2, btop);
            g.drawRect(b.x1, bbot, b.x2, bbot + 5);
            g.drawRect(b.x1 + 1, bbot + 5, b.x2 - 1, g.getHeight());

            if (b.x1 < 8 && (birdy - 3 < btop || birdy + 3 > bbot)) {
                return true;
            }
            return false;
        });
        if ( hit ) {
            // one of the barriers was hit
            return new GameOverScreen(this.restart, score)
        }

        while (barriers.length && barriers[0].x2 <= 0) {
            barriers.shift();
            newbarrier(84);
        }

        g.flip();

        return this;
    }

    init(): void {
        console.log("FlappyBird init");

        barriers = [];
        newbarrier(42);
        newbarrier(84);
        birdy = 48 / 2;
        birdvy = 0;
        score = 0;
        SPEED = 0.5;
    }

}

