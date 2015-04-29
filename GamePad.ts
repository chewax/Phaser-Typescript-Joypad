/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
/// <reference path="Button.ts"/>
/// <reference path="ButtonPad.ts"/>
/// <reference path="TouchInput.ts"/>

module Gamepads {

    export enum GamepadType {
        SINGLE_STICK = 1,
        DOUBLE_STICK = 2,
        STICK_BUTTON = 3,
        CORNER_STICKS = 4,
        GESTURE_BUTTON = 5,
        GESTURE = 6
    }

    export class GamePad extends Phaser.Plugin {

        game: Phaser.Game;

        stick1: Gamepads.Joystick;
        stick2: Gamepads.Joystick;
        stick3: Gamepads.Joystick;
        stick4: Gamepads.Joystick;

        buttonPad: Gamepads.ButtonPad;
        touchInput: Gamepads.TouchInput;

        info: Phaser.Text;
        test: number = 0;


        constructor (game: Phaser.Game, type:GamepadType, buttonPadType?: Gamepads.ButtonPadType) {
            super(game, new PIXI.DisplayObject());
            this.game = game;

            switch (type){
                case GamepadType.DOUBLE_STICK:
                    this.initDoublStick();
                    break;

                case GamepadType.SINGLE_STICK:
                    this.initSingleStick();
                    break;

                case GamepadType.STICK_BUTTON:
                    this.initStickButton(buttonPadType);
                    break;

                case GamepadType.CORNER_STICKS:
                    this.initCornerSticks();
                    break;

                case GamepadType.GESTURE_BUTTON:
                    this.initGestureButton(buttonPadType);
                    break;

                case GamepadType.GESTURE:
                    this.initGesture();
                    break;

            }

        }

        initDoublStick(): void {

            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_LEFT);
            this.stick2 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_RIGHT);

            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);

        }

        initCornerSticks(): void {

            //Add 2 extra pointers (2 by default + 2 Extra)
            this.game.input.addPointer();
            this.game.input.addPointer();

            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.BOTTOM_LEFT);
            this.stick2 = new Gamepads.Joystick(this.game, Gamepads.Sectors.TOP_LEFT);
            this.stick3 = new Gamepads.Joystick(this.game, Gamepads.Sectors.TOP_RIGHT);
            this.stick4 = new Gamepads.Joystick(this.game, Gamepads.Sectors.BOTTOM_RIGHT);

            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
            this.game.add.plugin(this.stick3, null);
            this.game.add.plugin(this.stick4, null);

        }

        initSingleStick(): void{
            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.ALL);
            this.game.add.plugin(this.stick1, null);
        }

        initStickButton(buttonPadType: Gamepads.ButtonPadType): void{
            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_LEFT);
            this.game.add.plugin(this.stick1, null);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
        }

        initGestureButton(buttonPadType: Gamepads.ButtonPadType){
            this.touchInput = new Gamepads.TouchInput(this.game, Gamepads.Sectors.HALF_LEFT);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
        }

        initGesture(){
            this.touchInput = new Gamepads.TouchInput(this.game, Gamepads.Sectors.ALL);
        }

        static preloadAssets (game:Phaser.Game, assets_path:string): void {
            Gamepads.Joystick.preloadAssets(game, assets_path);
            Gamepads.ButtonPad.preloadAssets(game, assets_path);
        }

    }
}