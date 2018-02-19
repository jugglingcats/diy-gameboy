import { Module, Button } from "./Module";
import { FlappyBird } from "./FlappyBird";
import { GetReadyScreen } from "./sharedScreens";
import { LunarLander } from "./lander/LunarLander";
import { Pong } from "./Pong";

const games = [
    {
        title: "Flappy Bird",
        game: new GetReadyScreen(new FlappyBird())
    },
    {
        title: "Lunar Lander",
        game: new GetReadyScreen(new LunarLander())
    },
    {
        title: "Pong",
        game: new GetReadyScreen(new Pong())
    }
];

let selectedGame = 0;

export class MainMenu implements Module {
    public id: string = "MainMenu";

    tick(g, buttons: Button[]): Module | undefined {
        g.clear();
        g.setFontBitmap();

        g.drawString("Choose game:", 0, 5);
        g.drawString(games[selectedGame].title, 0, 15);

        g.drawString("GREEN - select game", 0, 28);
        g.drawString("  RED - play", 0, 35);
        g.flip();

        if (buttons[0].pressed()) {
            selectedGame++;
            if (selectedGame >= games.length) {
                selectedGame = 0;
            }
        }
        if (buttons[1].pressed()) {
            return games[selectedGame].game;
        }
        return this;
    }

    init(): void {

    }

}