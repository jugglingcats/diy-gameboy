export function terrain_gen(count: number): number[] {
    let y = 46;
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
        if (y > 47) {
            y = 47;
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

