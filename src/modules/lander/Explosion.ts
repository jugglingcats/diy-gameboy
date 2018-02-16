import { Module, Button } from "../Module";

type Particle = {
    x: number,
    y: number,
    dx: number,
    dy: number
}

export class Particles {
    landscape: number[];
    particles:Particle[];
    duration;

    constructor(x: number, y: number, landscape:number[], count:number=10, duration:number=40) {
        this.duration=duration;
        this.landscape=landscape;
        this.particles=[];
        for ( let n=0; n< count; n++ ) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random()-0.5)*8,
                dy: (Math.random()-1.5)*5
            })
        }    
    }

    draw(g):boolean {
        this.particles.forEach(p => {
            p.y+=p.dy;
            const l=Math.round(p.x);
            if (p.y > this.landscape[l] && p.dy > 0.5) {
                p.y=this.landscape[l]-2;
                p.dx=0;
                p.dy=0;
            }
            p.x+=p.dx;
            p.dx*=0.9;
            p.dy*=0.9;
            p.dy+=0.3;
            g.drawRect(p.x, p.y, p.x+1, p.y+1);
        });

        return this.duration-- > 0;
    }

}

export class ExplosionDemo implements Module {
    id: string="Explosion";
    particles;
    landscape:number[]=[];
    count=0;

    constructor() {
        for ( let n=0; n< 80; n++ ) {
            this.landscape[n]=40;
        }
        this.particles=new Particles(40, 24, this.landscape);
    }

    tick(g: any, buttons: Button[]): Module | undefined {
        g.clear();
        if ( !this.particles.draw(g) ) {
            this.particles=new Particles(40, 40, this.landscape);
        }
        g.flip();
        return this;
    }

    init(g: any, buttons: Button[]): void {
    }
}