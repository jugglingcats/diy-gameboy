console.log("Hello Hugh");

var i2c = new I2C();
i2c.setup({ scl: D33, sda: D26 });
var mpu = require("MPU6050").connect(i2c);
const DMP = require("MPU6050_DMP").create(mpu, 3);

// pinMode(D26, "output");

pinMode(D13, 'input_pulldown');
pinMode(D25, 'input_pulldown');
pinMode(D35, 'input_pulldown');

setInterval(function () {
    if (D13.read()) {
        console.log("Yellow pressed");
    }

    if (D25.read()) {
        console.log("Red pressed");
    }

    if (D35.read()) {
        console.log("Green pressed");
    }

    var data = DMP.getData();
    if (data !== undefined) console.log(DMP.getYawPitchRoll(data));

    // var a = mpu.getAcceleration(); // returns an [x,y,z] array with raw accl. data
    // mpu.getGravity();  // returns acceleration array in G's
    // mpu.getRotation(); // returns an [x,y,z] array with raw gyro data
    // mpu.getDegreesPerSecond(); // returns gyro array in degrees/s
    // console.log(a);

}, 250);

