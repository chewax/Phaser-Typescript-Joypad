/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
/// <reference path="Button.ts"/>
/// <reference path="ButtonPad.ts"/>

module Gamepads {

    export enum GampadType {
        SINGLE_STICK = 1,
        DOUBLE_STICK = 2,
        STICK_BUTTON = 3,
        CORNER_STICKS = 4
    }

    export class GamePad extends Phaser.Plugin {

        game: Phaser.Game;

        stick1: Gamepads.Joystick;
        stick2: Gamepads.Joystick;
        stick3: Gamepads.Joystick;
        stick4: Gamepads.Joystick;

        buttonPad: Gamepads.ButtonPad;

        info: Phaser.Text;
        test: number = 0;


        constructor (game: Phaser.Game, type:GampadType, buttonPadType?: Gamepads.ButtonPadType) {
            super(game, new PIXI.DisplayObject() );
            this.game = game;

            switch (type){
                case GampadType.DOUBLE_STICK:
                    this.initDoublStick();
                    break;

                case GampadType.SINGLE_STICK:
                    this.initSingleStick();
                    break;

                case GampadType.STICK_BUTTON:
                    this.initStickButton(buttonPadType);
                    break;

                case GampadType.CORNER_STICKS:
                    this.initCornerSticks();
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

            var style = { font: "14px Courier", fill: "#ffffff", align: "left" };
            this.info = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '0', style);


            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_LEFT);
            this.game.add.plugin(this.stick1, null);

            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);


            function pressTest() {
                this.test += 1;
                this.info.text = this.test.toString();
            }

            //FOR TESTING
            this.buttonPad.button1.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button2.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button3.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button4.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button5.setOnPressedCallback(pressTest,this);

        }

        static preloadAssets (game:Phaser.Game, assets_path:string): void {
            Gamepads.Joystick.preloadAssets(game, assets_path);
            Gamepads.ButtonPad.preloadAssets(game, assets_path);
        }

    }
}