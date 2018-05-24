import { Module, Button, Services } from "./Module";
import { Highscores } from "./Highscores";

export class GetReadyScreen implements Module {
    id: string = "GetReadyScreen";
    caller: Module;
    count: number = 0;

    constructor(caller: Module) {
        this.caller = caller;
    }

    tick(services: Services): Module | undefined {
        const { graphics: g, buttons } = services;
        this.count++;

        const mid = g.getWidth() / 2;
        g.clear();
        g.setFontBitmap();
        if (this.count % 10 > 5) {
            g.drawString("Get Ready!", mid - g.stringWidth("Get Ready!") / 2, 18);
        }

        g.flip();

        if (this.count > 40) {
            return this.caller;
        }
        return this;
    }

    init(g: any): void {
        this.count = 0;

    }
}

export class GameOverScreen implements Module {
    gameId: string;
    id: string = "GameOverScreen";
    score: number;
    caller: Module;
    count: number = 0;

    constructor(caller: Module, gameId: string, score: number, highscores: any) {
        this.caller = caller;
        this.score = score;
        this.gameId = gameId;

        highscores.put(gameId, score);
    }

    tick(services: Services): Module | undefined {
        const { graphics: g, buttons, highscores } = services;
        const mid = g.getWidth() / 2;
        g.clear();
        g.setFontBitmap();
        g.drawString("Game Over!", mid - g.stringWidth("Game Over!") / 2, 5);

        const scoreText = "Score " + this.score;
        const highscoreText = "Highscore " + highscores.get(this.gameId);

        g.drawString(scoreText, mid - g.stringWidth(scoreText) / 2, 14);
        g.drawString(highscoreText, mid - g.stringWidth(highscoreText) / 2, 21);

        if (this.count++ > 35) {
            g.drawString(" GREEN - new game ", mid - g.stringWidth(" GREEN - new game ") / 2, 32);
            g.drawString("YELLOW - main menu", mid - g.stringWidth("YELLOW - main menu") / 2, 40);

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
        this.count = 0;
    }
}