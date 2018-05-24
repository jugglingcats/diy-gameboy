import { Sound } from "./Sound";

declare const require: any;

require("../espruino");

export type Services={
    graphics: any,
    buttons: Button[],
    highscores: any,
    sound: Sound
}

export interface Module {
    tick(services:Services): Module | undefined;
    init(services:Services): void;
    id: string;
}

export enum ButtonMode {
    CLICK,
    PRESS
}

export class Button {
    mode: ButtonMode=ButtonMode.CLICK;
    BTN: any;
    name: string;
    was_pressed: boolean;

    constructor(BTN: any, name: string) {
        this.BTN = BTN;
        this.was_pressed = false;
        this.name=name;

        pinMode(BTN, 'input_pulldown', false);
    }

    pressed():boolean {
        // console.log("Check btn");
        if ( digitalRead(this.BTN) ) {
            if (this.was_pressed === false || this.mode === ButtonMode.PRESS) {
                this.was_pressed=true;
                return true;
            }
        } else {
            this.was_pressed=false;
        }
        return false;
    }

    setMode(mode: ButtonMode) {
        this.mode=mode;
    }

    reset() {
        // this.pressed = false;
    }
}