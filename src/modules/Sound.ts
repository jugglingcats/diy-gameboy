export class Sound {
    pin: any;

    static readonly pitch = {
        'z': 10.00,
        'a': 220.00,
        'b': 246.94,
        'c': 261.63,
        'd': 293.66,
        'e': 329.63,
        'f': 349.23,
        'g': 392.00,
        'A': 440.00,
        'B': 493.88,
        'C': 523.25,
        'D': 587.33,
        'E': 659.26,
        'F': 698.46,
        'G': 783.99
    };

    static readonly tunes = {
        'welcome': [
            [Sound.pitch.a, 100],
            [Sound.pitch.A, 100],
            [undefined, 200],
            [Sound.pitch.b, 100],
            [Sound.pitch.G, 100], 
        ]
    }

    constructor(pin: any) {
        this.pin = pin;
        this.mute = this.mute.bind(this);
    }

    mute() {
        digitalWrite(this.pin, 0);
    }

    playNote(freq, duration) {
        analogWrite(this.pin, 0.5, { freq: freq });
        setTimeout(this.mute, duration);
    }

    playTune(tune: any) {
        if (tune) {
            new Player(this.pin, tune).next();
        }
    }
}

class Player {
    pin: any;
    tune: any;
    n: number = 0;

    constructor(pin: any, tune: any) {
        this.pin = pin;
        this.tune = tune;
        this.next = this.next.bind(this);
    }

    next() {
        if (this.n >= this.tune.length) {
            digitalWrite(this.pin, 0);
            return;
        }
        const [freq, dur] = this.tune[this.n++];
        if ( freq ) {
            analogWrite(this.pin, 0.5, { freq: freq });
        } else {
            digitalWrite(this.pin, 0);
        }
        setTimeout(this.next, dur);
    }
}