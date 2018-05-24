export function terrain_gen(count: number, height:number): number[] {
    let y = height-2;
    let change = 0;
    let repeat = 4;
    const result: number[] = [];
    for (let n = 0; n < count; n++) {
        if (change == 0) {
            if (Math.random() < 0.7) {
                change = -1;
            } else {
                change = +1;
            }
        }
        y += change;
        if (y > height-1) {
            y = height-1;
        }
        repeat--;
        if (repeat == 0) {
            change = 0;
            repeat = Math.round(Math.random() * 2 + 1);
        }
        result.push(y);
    }
    return result;
}

