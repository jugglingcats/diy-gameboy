import { Module, Button } from "./Module";

export class GetReadyScreen implements Module {
    id: string = "GetReadyScreen";
    caller: Module;
    count: number = 0;

    constructor(caller:Module) {
        this.caller=caller;
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        this.count++;

        g.clear();
        g.setFontBitmap();
        if ( this.count % 10 > 5 ) {
            g.drawString("Get Ready!", 40 - g.stringWidth("Get Ready!") / 2, 18);
        }

        g.flip();

        if (this.count > 40) {
            return this.caller;
        }
        return this;
    }

    init(g: any): void {
        this.count=0;

    }
}

export class GameOverScreen implements Module {
    id: string = "GameOverScreen";
    score: number;
    caller: Module;
    count: number=0;

    constructor(caller: Module, score: number) {
        this.caller=caller;
        this.score=score;
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        g.clear();
        g.setFontBitmap();
        g.drawString("Game Over!", 40 - g.stringWidth("Game Over!") / 2, 5);
        g.drawString("Score " + this.score, 25, 18);

        if ( this.count++ > 35 ) {
            g.drawString(" GREEN - new game", 6, 28);
            g.drawString("YELLOW - main menu", 6, 36);

            if (buttons[0].pressed()) {
                return this.caller;
            }
            if (buttons[2].pressed()) {
                return undefined; // main menu
            }
        }
        g.flip();
        return this;
    }

    init(): void {
        this.count=0;
    }
}