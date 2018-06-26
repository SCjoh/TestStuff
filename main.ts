﻿
/**
  * Enumeration of buttons
  */
enum BCButtons {
    //% block="red"
    Red,
    //% block="yellow"
    Yellow,
    //% block="green"
    Green,
    //% block="blue"
    Blue,
    //% block="joystick"
    Joystick
}

/**
  * Enumeration of joystick axes
  */
enum BCJoystick {
    //% block="x"
    X,
    //% block="y"
    Y
}


/**
 * Custom blocks
 */
//% weight=10 color=#e7660b icon="\uf185"
namespace cubebit {

    let nCube: neopixel.Strip;
    let cubeSide: number;

    /**
     * Create a Cube:Bit cube on Pin0
     * @param side number of pixels on each side
     */
    //% blockId="cubebit_create" block="create cube with side %side"
    //% weight=99
    //% side.min=3 side.max=8
    export function create(side: number): void
    {
        neo(side);
    }

    function neo(side: number): neopixel.Strip {
        if (!nCube)
        {
            cubeSide = side;
            nCube = neopixel.create(DigitalPin.P0, side*side*side, NeoPixelMode.RGB)
        }
        return nCube;
    }

    /**
      * Sets all pixels to a given colour (using colour names).
      *
      * @param rgb RGB colour of the pixel
      */
    //% blockId="cubebit_set_color" block="set all pixels to %rgb=neopixel_colors"
    //% weight=80
    export function setColor(rgb: number) {
        neo(3).showColor(rgb);
    }

    function pixelMap(x: number, y: number, z: number): number
    {
        let newx = x;
        let newy = y;
        switch (cubeSide)
        {
	    case 5:
                if (z==0 || z==2 || z==4)
                {
                    newy = y;
		    if (y==0 || y==2 || y==4)
                        newx = x;
                    else
                        newx = 4-x;
                }
                else
                {
                    if (x==0 || x==2 || x==4)
                    {
                        newy = x;
                        newx = y;
                    }
                    else
                    {
                        newy = 4-x;
                        newx = y;
                    }
                }
            default: newx = x;
        }
        return (z*cubeSide*cubeSide + newy*cubeSide + newx);
    }

    /**
     * Set a pixel to a given colour using x, y, z coordinates
     *
     * @param x position from left to right (x dimension)
     * @param y position from front to back (y dimension)
     * @param z position from bottom to top (z dimension)
     * @param rgb RGB color of the LED
     */
    //% blockId="cubebit_set_xyz_color" block="set pixel at x %x|y %y|z %z| to %rgb=neopixel_colors"
    //% weight=95
    export function setXYZColor(x: number, y: number, z: number, rgb: number): void {
        neo(3).setPixelColor(pixelMap(x,y,z), rgb);
    }

    /**
     * Get the pixel ID from x, y, z coordinates
     *
     * @param x position from left to right (x dimension)
     * @param y position from front to back (y dimension)
     * @param z position from bottom to top (z dimension)
     */
    //% blockId="cubebit_map_pixel" block="map from x %x|y %y|z %z"
    //% weight=93
    export function mapPixel(x: number, y: number, z: number): number {
        return pixelMap(x,y,z);
    }

    /**
     * Set a pixel to a given colour (using colour names).
     *
     * @param ID location of the pixel in the cube from 0
     * @param rgb RGB color of the LED
     */
    //% blockId="cubebit_set_pixel_color" block="set pixel color at %ID|to %rgb=neopixel_colors"
    //% weight=80
    export function setPixelColor(ID: number, rgb: number): void {
        neo(3).setPixelColor(ID, rgb);
    }

    /**
      * Show pixels
      */
    //% blockId="cubebit_show" block="show pixels"
    //% weight=76
    export function neoShow(): void {
        neo(3).show();
    }

    /**
      * Clear leds.
      */
    //% blockId="cubebit_clear" block="clear all pixels"
    //% weight=75
    export function neoClear(): void {
        neo(3).clear();
    }

    /**
      * Shows a rainbow pattern on all pixels
      */
    //% blockId="cubebit_rainbow" block="set pixel rainbow"
    //% weight=70
    export function neoRainbow(): void {
        neo(3).showRainbow(1, 360);
    }

    /**
     * Shift LEDs forward and clear with zeros.
     */
    //% blockId="cubebit_shift" block="shift pixels"
    //% weight=66
    export function neoShift(): void {
        neo(3).shift(1);
    }

    /**
     * Rotate LEDs forward.
     */
    //% blockId="cubebit_rotate" block="rotate pixels"
    //% weight=65
    export function neoRotate(): void {
        neo(3).rotate(1);
    }

    /**
     * Set the brightness of the cube. Note this only applies to future writes to the strip.
     *
     * @param brightness a measure of LED brightness in 0-255. eg: 255
     */
    //% blockId="cubebit_brightness" block="set led brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=10
    export function neoBrightness(brightness: number): void {
        neo(3).setBrightness(brightness);
    }


}
