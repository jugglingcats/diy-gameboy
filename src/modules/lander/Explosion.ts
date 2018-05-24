import { Module, Button, Services } from "../Module";

type Particle = {
    x: number,
    y: number,
    dx: number,
    dy: number
}

export class Particles {
    landscape: number[];
    particles: Particle[];
    duration;

    constructor(x: number, y: number, landscape: number[], count: number = 10, duration: number = 40) {
        this.duration = duration;
        this.landscape = landscape;
        this.particles = [];
        for (let n = 0; n < count; n++) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 1.5) * 5
            })
        }
    }

    draw(g): boolean {
        this.particles.forEach(p => {
            p.y += p.dy;
            const l = Math.round(p.x);
            if (p.y > this.landscape[l] && p.dy > 0.5) {
                p.y = this.landscape[l] - 2;
                p.dx = 0;
                p.dy = 0;
            }
            p.x += p.dx;
            p.dx *= 0.9;
            p.dy *= 0.9;
            p.dy += 0.3;
            g.drawRect(p.x, p.y, p.x + 1, p.y + 1);
        });

        return this.duration-- > 0;
    }

}

export class ExplosionDemo implements Module {
    id: string = "Explosion";
    particles;
    landscape: number[] = [];
    count = 0;

    tick(services: Services): Module | undefined {
        const { graphics: g } = services;
        g.clear();
        if (!this.particles.draw(g)) {
            g.flip();
            return undefined;
        }
        g.flip();
        return this;
    }

    init(services: Services): void {
        const { graphics: g } = services;
        for (let n = 0; n < g.getWidth(); n++) {
            this.landscape[n] = g.getHeight();
        }
        this.particles = new Particles(g.getWidth() / 2, g.getHeight() / 2, this.landscape);
    }
}