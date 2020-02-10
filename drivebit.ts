
/**
  * Enumeration of motors.
  */
enum dbMotor
{
    //% block="motor 1"
    M1,
    //% block="motor 2"
    M2,
    //% block="both"
    Both
}

/**
  * Enumeration of forward/reverse directions
  */
enum dbDirection
{
    //% block="forward"
    Forward,
    //% block="reverse"
    Reverse
}

/**
  * Enumeration of directions.
  */
enum dbRobotDirection
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Stop modes. Coast or Brake
  */
enum dbStopMode
{
    //% block="no brake"
    Coast,
    //% block="brake"
    Brake
}

/**
  * Pre-Defined LED colours
  */
enum dbColors
{
    //% block=red
    Red = 0xff0000,
    //% block=orange
    Orange = 0xffa500,
    //% block=yellow
    Yellow = 0xffff00,
    //% block=green
    Green = 0x00ff00,
    //% block=blue
    Blue = 0x0000ff,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xff00ff,
    //% block=white
    White = 0xffffff,
    //% block=black
    Black = 0x000000
}

/**
 * Custom blocks
 */
//% weight=50 color=#e7660b icon="\uf0f9"
namespace DriveBit
{
    let fireBand: fireled.Band;
    let _flashing = false;
    let leftBias = 0;
    let rightBias = 0;


// Motor Blocks

    function clamp(value: number, min: number, max: number): number
    {
        return Math.max(Math.min(max, value), min);
    }

    // slow PWM frequency for slower speeds to improve torque
    // only one PWM frequency available for all pins
    function setPWM(speed: number): void
    {
        if (speed < 200)
            pins.analogSetPeriod(AnalogPin.P12, 60000);
        else if (speed < 300)
            pins.analogSetPeriod(AnalogPin.P12, 40000);
        else
            pins.analogSetPeriod(AnalogPin.P12, 30000);
    }

    /**
      * Move both motors forward (or backward) at speed.
      * @param direction Move Forward or Reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      */
    //% blockId="dbGo" block="go %direction|at speed %speed"
    //% speed.min=0 speed.max=100
    //% weight=100
    //% subcategory=Motors
    export function go(direction: dbDirection, speed: number): void
    {
        move(dbMotor.Both, direction, speed);
    }

    /**
      * Move both motors forward (or backward) at speed for milliseconds
      * @param direction Move Forward or Reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 400
      */
    //% blockId="dbGoms" block="go %direction|at speed %speed|for %milliseconds|(ms)"
    //% speed.min=0 speed.max=100
    //% weight=90
    //% subcategory=Motors
    export function goms(direction: dbDirection, speed: number, milliseconds: number): void
    {
        go(direction, speed);
        basic.pause(milliseconds);
        stop(dbStopMode.Coast);
    }

    /**
      * Rotate robot in direction at speed
      * @param direction direction to turn
      * @param speed speed of motors (0 to 100). eg: 60
      */
    //% blockId="dbRotate" block="spin %direction|at speed %speed"
    //% speed.min=0 speed.max=100
    //% weight=80
    //% subcategory=Motors
    export function rotate(direction: dbRobotDirection, speed: number): void
    {
        if (direction == dbRobotDirection.Left)
        {
            move(dbMotor.M1, dbDirection.Reverse, speed);
            move(dbMotor.M2, dbDirection.Forward, speed);
        }
        else if (direction == dbRobotDirection.Right)
        {
            move(dbMotor.M1, dbDirection.Forward, speed);
            move(dbMotor.M2, dbDirection.Reverse, speed);
        }
    }

    /**
      * Rotate robot in direction at speed for milliseconds.
      * @param direction direction to spin
      * @param speed speed of motor between 0 and 100. eg: 60
      * @param milliseconds duration in milliseconds to spin for, then stop. eg: 400
      */
    //% blockId="dbRotatems" block="spin %direction|at speed %speed|for %milliseconds|(ms)"
    //% speed.min=0 speed.max=100
    //% weight=70
    //% subcategory=Motors
    export function rotatems(direction: dbRobotDirection, speed: number, milliseconds: number): void
    {
        rotate(direction, speed);
        basic.pause(milliseconds);
        stop(dbStopMode.Coast);
    }

    /**
      * Stop robot by coasting slowly to a halt or braking
      * @param mode Brakes on or off
      */
    //% blockId=dbStop" block="stop with %mode"
    //% weight=60
    //% subcategory=Motors
    export function stop(mode: dbStopMode): void
    {
        let stopMode = 0;
        if (mode == dbStopMode.Brake)
            stopMode = 1;
        pins.digitalWritePin(DigitalPin.P14, stopMode);
        pins.digitalWritePin(DigitalPin.P15, stopMode);
        pins.digitalWritePin(DigitalPin.P12, stopMode);
        pins.digitalWritePin(DigitalPin.P13, stopMode);
    }

    /**
      * Move individual motors forward or reverse
      * @param motor motor to drive
      * @param direction select forwards or reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      */
    //% blockId="dbMove" block="move %motor|motor(s) %direction|at speed %speed"
    //% weight=50
    //% speed.min=0 speed.max=100
    //% subcategory=Motors
    export function move(motor: dbMotor, direction: dbDirection, speed: number): void
    {
        speed = clamp(speed, 0, 100) * 10.23;
        setPWM(speed);
        let lSpeed = Math.round(speed * (100 - leftBias) / 100);
        let rSpeed = Math.round(speed * (100 - rightBias) / 100);
        if ((motor == dbMotor.M1) || (motor == dbMotor.Both))
        {
            if (direction == dbDirection.Forward)
            {
                pins.analogWritePin(AnalogPin.P12, lSpeed);
                pins.analogWritePin(AnalogPin.P13, 0);
            }
            else
            {
                pins.analogWritePin(AnalogPin.P12, 0);
                pins.analogWritePin(AnalogPin.P13, lSpeed);
            }
        }
        if ((motor == dbMotor.M2) || (motor == dbMotor.Both))
        {
            if (direction == dbDirection.Forward)
            {
                pins.analogWritePin(AnalogPin.P14, rSpeed);
                pins.analogWritePin(AnalogPin.P15, 0);
            }
            else
            {
                pins.analogWritePin(AnalogPin.P14, 0);
                pins.analogWritePin(AnalogPin.P15, rSpeed);
            }
        }
    }

    /**
      * Set left/right bias to match motors
      * @param direction direction to turn more (if robot goes right, set this to left)
      * @param bias percentage of speed to bias with eg: 10
      */
    //% blockId="dbBias" block="bias%direction|by%bias|%"
    //% bias.min=0 bias.max=80
    //% weight=40
    //% subcategory=Motors
    export function dbBias(direction: dbRobotDirection, bias: number): void
    {
        bias = clamp(bias, 0, 80);
        if (direction == dbRobotDirection.Left)
        {
            leftBias = bias;
            rightBias = 0;
        }
        else
        {
            leftBias = 0;
            rightBias = bias;
        }
    }


// FireLed Status Blocks

    // create a FireLed band if not got one already. Default to brightness 40
    function fire(): fireled.Band
    {
        if (!fireBand)
        {
            fireBand = fireled.newBand(DigitalPin.P16, 1);
            fireBand.setBrightness(40);
        }
        return fireBand;
    }

    // Always update status LED
    function updateLEDs(): void
    {
        fire().updateBand();
    }

    /**
      * Sets the status LED to a given color (range 0-255 for r, g, b).
      * @param rgb colour of the LED
      */
    //% blockId="db_set_led_color" block="set LED to %rgb=db_colours"
    //% weight=100
    //% subcategory=FireLed
    export function setLedColor(rgb: number)
    {
        stopFlash();
        setLedColorRaw(rgb);
    }

    function setLedColorRaw(rgb: number)
    {
        fire().setBand(rgb);
        updateLEDs();
    }

    /**
      * Clear LED
      */
    //% blockId="db_led_clear" block="clear LED"
    //% weight=70
    //% subcategory=FireLed
    export function ledClear(): void
    {
        stopFlash();
        ledClearRaw();
    }

    function ledClearRaw(): void
    {
        fire().clearBand();
        updateLEDs();
    }

    /**
     * Set the brightness of the LED
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% blockId="db_led_brightness" block="set LED brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=50
    //% subcategory=FireLed
    export function ledBrightness(brightness: number): void
    {
        fire().setBrightness(brightness);
        updateLEDs();
    }

    /**
      * Get numeric value of colour
      * @param color Standard RGB Led Colours eg: #ff0000
      */
    //% blockId="db_colours" block=%color
    //% blockHidden=false
    //% weight=60
    //% subcategory=FireLed
    //% blockGap=8
    //% shim=TD_ID colorSecondary="#e7660b"
    //% color.fieldEditor="colornumber"
    //% color.fieldOptions.decompileLiterals=true
    //% color.defl='#ff0000'
    //% color.fieldOptions.colours='["#FF0000","#659900","#18E600","#80FF00","#00FF00","#FF8000","#D82600","#B24C00","#00FFC0","#00FF80","#FFC000","#FF0080","#FF00FF","#B09EFF","#00FFFF","#FFFF00","#8000FF","#0080FF","#0000FF","#FFFFFF","#FF8080","#80FF80","#40C0FF","#999999","#000000"]'
    //% color.fieldOptions.columns=5
    //% color.fieldOptions.className='rgbColorPicker'
    export function dbColours(color: number): number
    {
        return color;
    }

    /**
      * Convert from RGB values to colour number
      *
      * @param red Red value of the LED (0 to 255)
      * @param green Green value of the LED (0 to 255)
      * @param blue Blue value of the LED (0 to 255)
      */
    //% blockId="db_convertRGB" block="convert from red %red| green %green| blue %blue"
    //% weight=40
    //% subcategory=FireLed
    export function convertRGB(r: number, g: number, b: number): number
    {
        return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
    }

    /**
      * Start Flashing
      * @param color the colour to flash
      * @param delay time in ms for each flash, eg: 100,50,200,500
      */
    //% blockId="startFlash" block="start flash %color=db_colours| at %delay|(ms)"
    //% subcategory=FireLed
    //% delay.min=1 delay.max=10000
    //% weight=90
    export function startFlash(color: number, delay: number): void
    {
        if(_flashing == false)
        {
            _flashing = true;
            control.inBackground(() =>
            {
                while (_flashing)
                {                                
                    setLedColorRaw(color);
                    basic.pause(delay);
                    if (! _flashing)
                        break;
                    ledClearRaw();
                    basic.pause(delay);
                }
            })
        }
    }

    /**
      * Stop Flashing
      */
    //% block
    //% subcategory=FireLed
    //% weight=80
    export function stopFlash(): void
    {
        _flashing = false;
    }


}
