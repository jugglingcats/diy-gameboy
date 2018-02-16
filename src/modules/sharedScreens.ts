import { Module, Button } from "./Module";
import { flashHandler } from "../app";
import { Highscores } from "./Highscores";

const highscores = new Highscores(flashHandler);

export class GetReadyScreen implements Module {
    id: string = "GetReadyScreen";
    caller: Module;
    count: number = 0;

    constructor(caller: Module) {
        this.caller = caller;
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        this.count++;

        g.clear();
        g.setFontBitmap();
        if (this.count % 10 > 5) {
            g.drawString("Get Ready!", 40 - g.stringWidth("Get Ready!") / 2, 18);
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

    constructor(caller: Module, gameId: string, score: number) {
        this.caller = caller;
        this.score = score;
        this.gameId = gameId;

        highscores.put(gameId, score);
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        g.clear();
        g.setFontBitmap();
        g.drawString("Game Over!", 40 - g.stringWidth("Game Over!") / 2, 5);

        const scoreText = "Score " + this.score;
        const highscoreText = "Highscore " + highscores.get(this.gameId);

        g.drawString(scoreText, 40 - g.stringWidth(scoreText) / 2, 14);
        g.drawString(highscoreText, 40 - g.stringWidth(highscoreText) / 2, 21);

        if (this.count++ > 35) {
            g.drawString(" GREEN - new game", 6, 32);
            g.drawString("YELLOW - main menu", 6, 40);

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