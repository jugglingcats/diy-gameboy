import { Button } from "./modules/Module";

const PCD8544 = require("PCD8544");

require("./espruino");

const buttons = [
    new Button(B3, "Green"),
    new Button(B4, "Red"),
    new Button(B7, "Yellow")
]

export function run() {
    console.log("Starting Espruino Pico app");
    var spi = new SPI();
    spi.setup({ sck: B1, mosi: B10 });
    const g = PCD8544.connect(spi, B13, B14, B15, function () {
        // g.drawString("Hello world", 10, 10);
        // g.flip();
        require("./app").start(g, buttons);
        console.log("App started!");
    }, {cs: B15, height: 64});
}
