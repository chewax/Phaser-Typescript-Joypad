# Phaser-Typescript-Joypad


This is a phaser plugin to handle the user input in a tactile screen in the fashion of a console Joypad.


Usage
-----

Clone the repository and copy the classes into your proyect. They must all be in the same folder. You just need to require GamePad.ts
In the create method of your game, instanciate the GamePad class:

`var g = new Gamepads.GamePad(this.game, Gamepads.GampadType.STICK_BUTTON, Gamepads.ButtonPadType.THREE_INLINE_Y);`

Gamepad Types
-------------

There are four different gamepad types that can be created

* SINGLE_STICK - One Joystick that listens all the screen
* DOUBLE_STICK - Two Joysticks one on each half of the screen
* STICK_BUTTON - One Joystick on the left half plus a button pad
* CORNER_STICKS - Four Joysticks one on each corner

---

When instanciating the STICK_BUTTON the type of the buttonpad must also be provided. The options are:

* ONE_FIXED
* TWO_INLINE_X
* TWO_INLINE_Y
* THREE_INLINE_X
* THREE_INLINE_Y
* THREE_FAN
* FOUR_STACK
* FOUR_INLINE_X
* FOUR_INLINE_Y
* FOUR_FAN
* FIVE_FAN



