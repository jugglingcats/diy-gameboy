// export const flashHandler = new (require("./src/FlashEEPROM"))();

declare const require: any;
console.log("\n\nStarting app...");
require("./src/esp32-sh1106-bootstrap").run();
// require("./src/esp32-ili9163-bootstrap").run();
// require("./src/espruino-pico-bootstrap").run();