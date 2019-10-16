{
  // Drive full speed forward
  DriveBit.drive(1023);
  basic.pause(1000);

  // Drive full speed reverse for 300 ms
  DriveBit.driveMiliseconds(-1023, 300);
  basic.pause(1000);

  // Drive 100 ms forward on left and reverse on right
  DriveBit.motor(DBMotor.Left, 1023);
  DriveBit.motor(DBMotor.Right, -1023);
  basic.pause(1000);

  // Drive at speed 600 then stop fast with Braking
  DriveBit.drive(600)
  basic.pause(1000)
  DriveBit.stop(DBStopMode.Brake)
  basic.pause(1000)

  // Set status LED to Red
  DriveBit.setLedColor(DriveBit.DBColours(DBColors.Red));
  basic.pause(1000);

  // Clear LED
  DriveBit.ledClear();
  basic.pause(1000);

  // Start LED Flashing Blue every 300ms
  DriveBit.startFlash(DriveBit.DBColours(DBColors.Blue), 300)
  basic.pause(1000);

  // Stop LED Flashing
  DriveBit.stopFlash();
  basic.pause(1000);

  // Set brightness of LED
  DriveBit.ledBrightness(100);
  basic.pause(1000);

}
