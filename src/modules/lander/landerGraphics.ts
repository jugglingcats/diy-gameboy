export const landerw = 8;
export const landerh = 8;
export const landerBody = {
    width: landerw, height: landerh, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b00011000,
        0b00100100,
        0b01000010,
        0b01011010,
        0b01000010,
        0b01011010,
        0b10000001,
        0b11111111,
    ]).buffer
};

export const landerJet = {
    width: 8, height: 4, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b10000001,
        0b01000010,
        0b00100100,
        0b00011000,
    ]).buffer
};

const flagw = 8;
export const flagh = 8;

export const flag = {
    width: flagw, height: flagh, bpp: 1,
    transparent: 0,
    buffer: new Uint8Array([
        0b01111110,
        0b01000010,
        0b01000010,
        0b01111110,
        0b01000000,
        0b01000000,
        0b01000000,
        0b01000000,
    ]).buffer
};

