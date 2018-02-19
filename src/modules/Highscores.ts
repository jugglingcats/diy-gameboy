import { flash } from "../app";

// const free = flash.getFree();
// const freeAddr = free[0].addr;
// const page = flash.getPage(freeAddr);
// const base = page.addr;

function xwrite(str: string) {
    console.log("writing flash", str);
    // console.log("Trans", str.split(''));
    var arr: number[] = [];
    // for (var i = 0; i < str.length; i++) {
    //     arr.push(str.charCodeAt(i));
    // }
    // let pad = 4 - str.length % 4;
    // console.log("first part", arr.length, "pad required: ", pad);
    // while (pad-- > 0) {
    //     arr.push(0);
    // }
    // console.log("padding done, creating array");
    // const a = new Uint8Array([0,1,2,3]);
    // console.log("Writing to flash", a, a.length);
    // flash.write(a, base);
}

const first = "x"; // flash.read(1, base);
console.log(first);
if (first[0] != '{') {
    console.log("Bad flash detected!");
    // xwrite("{}  ");
}

console.log("Highscores module loaded!");

export class Highscores {
    scores: any;
    flash;

    constructor(flashHandler: any) {
        this.flash = flashHandler;
        const v = undefined; // flashHandler.read(0);
        if (v) {
            const json = E.toString(v);
            this.scores = JSON.parse(json);
            console.log("Loaded scores: ", this.scores);
        } else {
            this.scores = {};
        }
    }

    get(id: string): number {
        return this.scores[id] || 0;
    }

    put(id: string, score: number) {
        const current = this.scores[id];
        if (current >= score) {
            return;
        }
        console.log("Store new highscore: ", id, score);
        this.scores[id] = score;
        // this.flash.write(0, JSON.stringify(this.scores));
        // this.flash.cleanup();
    }
}
