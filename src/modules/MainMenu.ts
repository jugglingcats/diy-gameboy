import { Module, Button, Services } from "./Module";
import { GetReadyScreen } from "./sharedScreens";
import { LunarLander } from "./lander/LunarLander";
import { FlappyBird } from "./FlappyBird";
import { Pong } from "./Pong";
import { Highscores } from "./Highscores";

const games: any[] = [
    // {
    //     title: "Explosion Demo",
    //     game: new GetReadyScreen(new ExplosionDemo())
    // },
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

    tick(services: Services): Module | undefined {
        const { graphics: g, buttons } = services;
        g.clear();

        g.drawString("Choose game:", 0, 5);
        if (games[selectedGame]) {
            g.drawString(games[selectedGame].title, 0, 15);
        }

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