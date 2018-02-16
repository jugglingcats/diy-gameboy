console.log("Highscores module loaded!");

export class Highscores {
    scores: any;
    flash;

    constructor(flashHandler:any) {
        this.flash=flashHandler;
        const v=flashHandler.read(1);
        if ( v ) {
            const json=E.toString(v);
            this.scores=JSON.parse(json);
            console.log("Loaded scores: ", this.scores);
        } else {
            this.scores={};
        }
    }

    get(id: string):number {
        return this.scores[id] || 0;
    }

    put(id: string, score: number) {
        const current=this.scores[id];
        if ( current >= score ) {
            return;
        }
        console.log("Store new highscore: ", id, score);
        this.scores[id]=score;
        this.flash.write(1, JSON.stringify(this.scores));
    }
}
