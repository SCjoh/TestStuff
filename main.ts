﻿
/**
  * Enumeration of axes
  */
enum CBAxis {
    //% block="x"
    X,
    //% block="y"
    Y,
    //% block="z"
    Z
}

/**
 * Custom blocks
 */
//% weight=10 color=#e7660b icon="\uf247"
namespace cubebit {

    let nCube: neopixel.Strip;
    let cubeHeight: number;
    let cubeSide: number;
    let cubeSide2: number;
    let cubeSide3: number;

    /**
     * Create a Cube:Bit cube (default 3x3x3) on Selected Pin (default Pin0)
     * @param pin Micro:Bit pin to connect to Cube:Bit
     * @param side number of pixels on each side
     */
    //% blockId="cubebit_create" block="create Cube:Bit on %pin| with side %side"
    //% weight=98
    //% side.min=3 side.max=8
    export function create(pin: DigitalPin, side: number): void
    {
        neo(pin, side);
    }

    function neo(pin: DigitalPin, side: number): neopixel.Strip
    {
        if (!nCube)
        {
            if (! cubeHeight)
                cubeHeight = side;
            cubeSide = side;
            cubeSide2 = side * side;
            cubeSide3 = side * side * cubeHeight;
            nCube = neopixel.create(pin, cubeSide3, NeoPixelMode.RGB);
            nCube.setBrightness(40);
        }
        return nCube;
    }

    /**
      * Sets all pixels to a given colour
      *
      * @param rgb RGB colour of the pixel
      */
    //% blockId="cubebit_set_color" block="set all pixels to %rgb=neopixel_colors"
    //% weight=80
    export function setColor(rgb: number): void
    {
        neo(DigitalPin.P0,3).showColor(rgb);
    }

    function pixelMap(x: number, y: number, z: number): number
    {
        let q=0;
        if (x<cubeSide && y<cubeSide && z<cubeSide && x>=0 && y>=0 && z>=0)
        {
            if ((z%2) == 0)
            {
                if ((y%2) == 0)
                    q = y * cubeSide + x;
                else
                    q = y * cubeSide + cubeSide - 1 - x;
            }
            else
            {
                if ((x%2) == 0)
                    q = cubeSide * (cubeSide - x) - 1 - y;
                else
                    q = (cubeSide - 1 - x) * cubeSide + y;
            }
        }
        return z*cubeSide*cubeHeight + q;
    }

    /**
      * Sets a plane of pixels to given colour
      *
      * @param plane number of plane from 0 to size of cube
      * @param axis axis (x,y,z) of no change within plane
      * @param rgb RGB colour of the pixel
      */
    //% blockId="cubebit_set_plane" block="set plane %plane| on axis %axis=CBAxis| to %rgb=neopixel_colors"
    //% weight=79
    export function setPlane(plane: number, axis: CBAxis, rgb: number): void
    {
        if (axis == CBAxis.X)
        {
            for (let y=0; y<cubeSide; y++)
                for (let z=0; z<cubeHeight; z++)
                    nCube.setPixelColor(pixelMap(plane,y,z), rgb);
        }
        if (axis == CBAxis.Z)
        {
            for (let x=0; x<cubeSide; x++)
                for (let y=0; y<cubeSide; y++)
                    nCube.setPixelColor(pixelMap(x,y,plane), rgb);
        }
    }

    /**
      * Defines a custom height for the Cube (height>0)
      *
      * @param height number of slices in the tower
      */
    //% blockId="cubebit_set_height" block="set height of tower to %height"
    //% weight=80
    //% deprecated=true
    export function setHeight(height: number): void
    {
        if (! cubeHeight)
            cubeHeight = height;
    }

    /**
     * Get the pixel ID from x, y, z coordinates
     *
     * @param x position from left to right (x dimension)
     * @param y position from front to back (y dimension)
     * @param z position from bottom to top (z dimension)
     */
    //% blockId="cubebit_map_pixel" block="map 49ID from x %x|y %y|z %z"
    //% weight=93
    export function mapPixel(x: number, y: number, z: number): number
    {
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
    export function setPixelColor(ID: number, rgb: number): void
    {
        neo(DigitalPin.P0,3).setPixelColor(ID, rgb);
    }

    /**
     * Convert from RGB values to colour number
     *
     * @param red Red value of the LED 0:255
     * @param green Green value of the LED 0:255
     * @param blue Blue value of the LED 0:255
     */
    //% blockId="cubebit_convertRGB" block="convert from red %red| green %green| blue %bblue"
    //% weight=80
    export function convertRGB(r: number, g: number, b: number): number
    {
        return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
    }

    /**
      * Show pixels
      */
    //% blockId="cubebit_show" block="show Cube:Bit changes"
    //% weight=76
    export function neoShow(): void
    {
        neo(DigitalPin.P0,3).show();
    }

    /**
      * Clear leds.
      */
    //% blockId="cubebit_clear" block="clear all pixels"
    //% weight=75
    export function neoClear(): void
    {
        neo(DigitalPin.P0,3).clear();
    }

    /**
      * Shows a rainbow pattern on all pixels
      */
    //% blockId="cubebit_rainbow" block="set Cube:Bit rainbow"
    //% weight=70
    export function neoRainbow(): void
    {
        neo(DigitalPin.P0,3).showRainbow(1, 360);
    }

    /**
     * Shift LEDs forward and clear with zeros.
     */
    //% blockId="cubebit_shift" block="shift pixels"
    //% weight=66
    export function neoShift(): void
    {
        neo(DigitalPin.P0,3).shift(1);
    }

    /**
     * Rotate LEDs forward.
     */
    //% blockId="cubebit_rotate" block="rotate pixels"
    //% weight=65
    export function neoRotate(): void
    {
        neo(DigitalPin.P0,3).rotate(1);
    }

    /**
     * Set the brightness of the cube. Note this only applies to future writes to the strip.
     *
     * @param brightness a measure of LED brightness in 0-255. eg: 255
     */
    //% blockId="cubebit_brightness" block="set Cube:Bit brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=10
    export function neoBrightness(brightness: number): void
    {
        neo(DigitalPin.P0,3).setBrightness(brightness);
    }


}
