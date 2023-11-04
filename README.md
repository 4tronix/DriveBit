# MakeCode Package for Drive:Bit Motor Controller Board

This library provides a Microsoft Makecode package for [4tronix Drive:Bit motor controller](https://4tronix.co.uk/drivebit)

## Driving the robot    
The simplest way to drive the robot is by using the `go(...)` or `goms(...)` blocks.
With each of these blocks you specify Forward or Reverse, and a speed from 0 to 100.
Both motors will be driven at the selected speed and direction.

Move forward at speed 60 forever:

```block
DriveBit.go(dbDirection.Forward, 60)
```

Move backward at speed 100 for 2000 ms:

```block
DriveBit.goms(dbDirection.Reverse, 100, 2000)
```

You can also spin/rotate the robot with the `rotate(...)` or `rotatems(...)` blocks

Rotate left at speed 70:

```block
DriveBit.rotate(dbRobotDirection.Left, 70)
```

Rotate right at speed 50 for 400ms:

```block
DriveBit.rotatems(dbRobotDirection.Right, 50, 400)
```   

## Stopping
When the motor speed is set to zero then it stops. However, we can also use the motor itself to create a reverse generated current to brake much quicker.
This helps when aiming for more accurate manoeuvres. Use the `stop(...)` command to stop with braking, or coast to a halt.

Slowly coast to a stop:

```block
DriveBit.stop(dbStopMode.Coast)
```

Stop rapidly with braking:

```block
DriveBit.stop(dbStopMode.Brake)
```

## Driving the motors individually

If you want more fine grain control of individal motors, use `DriveBit.move(...)` to drive motor either forward or reverse.
You can specify the direction (Forward or Reverse) and speed between 0 and 100.
If the left motor turns slower than the right motor, the robot will turn to the left


Drive both motors forward at speed 60. Equivalent to `DriveBit.go(dbDirection.Forward, 60)`:

```block
DriveBit.move(dbMotor.Both, dbDirection.Forward, 60)
```

Drive left motor in reverse at speed 30:

```block
DriveBit.move(dbMotor.Left, dbDirection.Reverse, 30)
```

Drive forward in a leftward curve:

```blocks
DriveBit.move(dbMotor.Left, dbDirection.Forward, 40)
DriveBit.move(dbMotor.Right, dbDirection.Forward, 70)
```

## Making the Robot Drive Straight

The small DC motors typically used with the DriveBit are not guaranteed to go at the same speed as each other.
This can cause the robot to veer off the straight line, either to left or to right, even when both motors are programmed to go
at the same speed.
We can partially correct for this by adding a direction bias to the motor speed settings.
If your robot is veering to the right, then set the bias to the left.
Conversely, if your robot is turning to the left, then set the bias to the right.
It varies with speed and battery condition etc, but an approximation is that a 10% bias will result in about 15cm (6 inches)
change of course over about 2m (6 feet).

If the robot leaves straight line to the right by about 10cm over 2m, bias it to the left by 5%:

```block
DriveBit.dbBias(dbRobotDirection.Left, 5)
```

If the robot leaves straight line to left by 25cm, bias it to the right by 15%:

```block
DriveBit.dbBias(dbRobotDirection.Right, 15)
```

## FireLed helpers

The DriveBit has a single FireLed fitted. This library defines some helpers
for using it.
The FireLed is automatically updated after every setting

Set status FireLed to Green:

```block
DriveBit.setLedColor(0x00FF00)
```

Use the `startFlash(...)` block to start the LED flashing in the background at your selected speed (in ms) and colour.

This example starts flashing the status LED in Red, once per second:

```block
DriveBit.startFlash(0xff0000, 1000)
```

Use the `stopFlash(...)` block to stop flashing the status LED:

```block
DriveBit.stopFlash()
```

Clear the status LED:

```block
DriveBit.ledClear()
```

## Supported targets

* for PXT/microbit

## License

MIT
