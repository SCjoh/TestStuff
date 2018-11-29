﻿
/**
  * Enumeration of motors.
  */
enum RBMotor {
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="all"
    All
}

/**
  * Enumeration of servos
  */
enum Servos
{
    FL_Hip,
    FL_Knee,
    RL_Hip,
    RL_Knee,
    RR_Hip,
    RR_Knee,
    FR_Hip,
    FR_Knee,
    Head,
    Tail
}

/**
  * Enumeration of limbs
  */
enum Limbs
{
    FrontLeft,
    RearLeft,
    RearRight,
    FrontRight
}

/**
  * Enumeration of directions.
  */
enum RBRobotDirection {
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Enumeration of line sensors.
  */
enum RBLineSensor {
    //% block="left"
    Left,
    //% block="right"
    Right
}


/**
  * Enumeration of Robobit Models and Options
  */
enum RBModel {
    //% block="Mk1"
    Mk1,
    //% block="Mk2"
    Mk2, 
    //% block="Mk2/LedBar"
    Mk2A, 
    //% block="Mk3"
    Mk3
}

/**
 * Ping unit for sensor
 */
enum RBPingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}

/**
 * Custom blocks
 */

//% weight=10 color=#e7660b icon="\uf188"
namespace Animoid {

    let _model: RBModel;
    let PCA = 0x6A;	// i2c address of 4tronix Animoid servo controller
    let initI2C = false;
    let SERVOS = 0x06; // first servo address for start byte low
    let lLower = 57;	// distance from servo shaft to tip of leg/foot
    let lUpper = 46;	// distance between servo shafts
    let lLower2 = lLower * lLower;	// no point in doing this every time
    let lUpper2 = lUpper * lUpper;

    // Helper functions

    /**
      * Select I2C Address of PCA9685 chip
      *
      * @param i2c Address of PCA9685 (64 or 106)
      */
    //% blockId="i2c_address" block="select 45 I2C address %i2c"
    //% weight=90
    export function i2c_address(i2c: number = 64): void
    {
        PCA = i2c;
    }

    /**
      * Return servo number from name
      *
      * @param value servo name
      */
    //% blockId="getServo" block="%value"
    //% weight=80
    export function getServo(value: Servos): number
    {
        return value;
    }

    function initPCA(): void
    {

        let i2cData = pins.createBuffer(2);
        initI2C = true;

        i2cData[0] = 0;		// Mode 1 register
        i2cData[1] = 0x10;	// put to sleep
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = 0xFE;	// Prescale register
        i2cData[1] = 101;	// set to 60 Hz
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = 0;		// Mode 1 register
        i2cData[1] = 0x81;	// Wake up
        pins.i2cWriteBuffer(PCA, i2cData, false);

    }

    /**
      * Set Servo Position by Angle
      *
      * @param servo Servo number (0 to 15)
      * @param angle degrees to turn servo (-90 to +90)
      */
    //% blockId="setServo" block="set servo %servo| to angle %angle"
    //% angle.min = -90 angle.max = 90
    //% weight = 70
    export function setServo(servo: number, angle: number): void
    {
        if (initI2C == false)
        {
            initPCA();
        }
        let i2cData = pins.createBuffer(2);
        // two bytes need setting for start and stop positions of the servo
        // servos start at SERVOS (0x06) and are then consecutive bloocks of 4 bytes
        let start = 0;
        let stop = 369 + angle * 275 / 90;

        i2cData[0] = SERVOS + servo*4 + 0;	// Servo register
        i2cData[1] = 0x00;			// low byte start - always 0
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = SERVOS + servo*4 + 1;	// Servo register
        i2cData[1] = 0x00;			// high byte start - always 0
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = SERVOS + servo*4 + 2;	// Servo register
        i2cData[1] = (stop & 0xff);		// low byte stop
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = SERVOS + servo*4 + 3;	// Servo register
        i2cData[1] = (stop >> 8);			// high byte stop
        pins.i2cWriteBuffer(PCA, i2cData, false);
    }

    /**
      * Set Position of Foot in mm from hip servo shaft
      * Inverse kinematics from learnaboutrobots.com/inverseKinematics.htm
      *
      * @param limb Determines which limb to move. eg. FrontLeft
      * @param xpos Position on X-axis in mm
      * @param height Height of hip servo shaft above foot
      */
    //% blockId="setLimb" block="set %limb| to position %xpos| height %height"
    //% weight = 60
    export function setLimb(limb: Limbs, xpos: number, height: number): void
    {
        let B2 = xpos*xpos + height*height;	// from: B2 = Xhand2 + Yhand2
        let q1 = Math.atan2(height, xpos);	// from: q1 = ATan2(Yhand/Xhand)
        let q2 = Math.acos((lUpper2 - lLower2 + B2) / (2 * lUpper * Math.sqrt(B2)));
        let hip = Math.floor(q1 + q2);
        let knee = Math.acos((lUpper2 + lLower2 - B2) / (2 * lUpper * lLower));
        basic.showNumber(limb*2);
        basic.showNumber(hip);
        setServo(limb*2, hip);
        setServo(limb*2+1, knee);
    }

}