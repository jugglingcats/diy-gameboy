declare const require: any;

require("../espruino");

export interface Module {
    tick(g: any, buttons: Button[]): Module | undefined;
    init(g: any, buttons: Button[]): void;
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

        // setWatch(e => {
        //     console.log("Button pressed!", name);
        //     this.pressed = true;
        // }, BTN, {
        //         repeat: true,
        //         edge: 'rising',
        //         debounce: 5
        //     });

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