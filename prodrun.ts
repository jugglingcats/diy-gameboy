declare const require: any;
declare const reset: any;

declare let onInit:Function;
declare const save:Function;

console.log("\n\nApp being installed...");
export const start = require("./src/app").start;

console.log("Done! Now run onInit=Lameboy.start;save()");


