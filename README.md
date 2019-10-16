# MakeCode Package for Drive:Bit Motor Controller Board

This library provides a Microsoft Makecode package for 4tronix Drive:Bit

## Driving the robot    
The simplest way to drive robot is by using the `driveMilliseconds(...)` and `driveTurnMilliseconds(...)` blocks.   
Note with `driveMilliseconds(...)`, you can specify a negative speed to reverse.   
```blocks
// Drive forward for 2000 ms
DriveBit.driveMilliseconds(1023, 2000)

// Drive backwards for 2000 ms
DriveBit.driveMilliseconds(-1023, 2000)

// Spin left for 200 ms
DriveBit.spinMilliseconds(DBRobotDirection.Left, 1023, 200)

// Turn right for 200 ms
DriveBit.spinMilliseconds(DBRobotDirection.Right, 1023, 200)
```   

These blocks are also available in non blocking version. The following example performs the same operation as above.   
```blocks
DriveBit.drive(1023)
basic.pause(1000)

DriveBit.drive(0)
basic.pause(1000)

DriveBit.spin(DBRobotDirection.Left, 1023)
basic.pause(250)

DriveBit.spin(DBRobotDirection.Right, 1023)
basic.pause(250)

DriveBit.drive(0)
```

## Stopping
When the motor speed is set to zero then it stops. However, we can also use the motor itself to create a reverse generated current to brake much quicker.
This helps when aiming for more accurate manoeuvres. Use the `TH.stop(...)` command to stop with braking, or coast to a halt
```blocks
DriveBit.stop(DBStopMode.Coast) # slowly coast to a stop
DriveBit.stop(DBStopMode.Brake) # rapidly brake
```

## Driving the motor

If you want more fine grain control of individal motors, use `DB.motor(..)` to drive motor either forward or reverse. The value
indicates speed and is between `-1023` to `1023`. Minus indicates reverse.

```blocks
// Drive 1000 ms forward
DriveBit.motor(DBMotor.Both, 1023);
basic.pause(1000);

// Drive 1000 ms reverse
DriveBit.motor(DBMotor.Both, -1023);
basic.pause(1000);

// Drive 1000 ms forward on left and reverse on right
DriveBit.motor(DBMotor.M1, 1023);
DriveBit.motor(DBMotor.M2, -1023);
basic.pause(1000);
```

## Smart RGB LED helpers

The DriveBit has a single  smart RGB LED (aka neopixel) fitted. This library defines some helpers
for using it.
The LED is Automatically updated after every setting

```blocks
// Clear LED
DriveBit.ledClear();

// Set LED to Red
DriveBit.setLedColor(DriveBit.DBColours(DBColors.Red));

// Set brightness of LED
DriveBit.ledBrightness(40);

// Start Flashing the LED
DriveBit.startFlash(DriveBit.DBColours(DBColors.Red), 100);

// Stop flashing the LED
DriveBit.stopFlash();
```

## Supported targets

* for PXT/microbit

## License

MIT
