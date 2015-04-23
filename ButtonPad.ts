/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Button.ts"/>

module Gamepads {

    export enum ButtonPadType {

        ONE_FIXED = 1,
        TWO_INLINE_X = 2,
        TWO_INLINE_Y = 3,
        THREE_INLINE_X = 4,
        THREE_INLINE_Y = 5,
        THREE_FAN = 6,
        FOUR_STACK = 7, //2 OVER 2
        FOUR_INLINE_X = 8,
        FOUR_INLINE_Y = 9,
        FOUR_FAN = 10,
        FIVE_FAN = 11,

    }

    export class ButtonPad extends Phaser.Plugin {

        game:Phaser.Game;
        type: ButtonPadType;
        buttonSize: number;

        button1: Gamepads.Button;
        button2: Gamepads.Button;
        button3: Gamepads.Button;
        button4: Gamepads.Button;
        button5: Gamepads.Button;

        padding: number = 10;

        constructor(game:Phaser.Game, type: ButtonPadType, buttonSize:number) {
            super(game, new PIXI.DisplayObject());
            this.game = game;
            this.type = type;
            this.buttonSize = buttonSize;

            switch (this.type){
                case ButtonPadType.ONE_FIXED:
                    this.initOneFixed();
                    break;

                case ButtonPadType.TWO_INLINE_X:
                    this.initTwoInlineX();
                    break;

                case ButtonPadType.THREE_INLINE_X:
                    this.initThreeInlineX();
                    break;

                case ButtonPadType.FOUR_INLINE_X:
                    this.initFourInlineX();
                    break;

                case ButtonPadType.TWO_INLINE_Y:
                    this.initTwoInlineY();
                    break;

                case ButtonPadType.THREE_INLINE_Y:
                    this.initThreeInlineY();
                    break;

                case ButtonPadType.FOUR_INLINE_Y:
                    this.initFourInlineY();
                    break;

                case ButtonPadType.FOUR_STACK:
                    this.initFourStack();
                    break;

                case ButtonPadType.THREE_FAN:
                    this.initThreeFan();
                    break;

                case ButtonPadType.FOUR_FAN:
                    this.initFourFan();
                    break;

                case ButtonPadType.FIVE_FAN:
                    this.initFiveFan();
                    break;
            }

        }

        initOneFixed (): number {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            this.game.add.plugin(this.button1);
            return offsetX;
        }

        initTwoInlineX (): number {
            var offsetX = this.initOneFixed();
            var offsetY = this.game.height - this.padding;

            offsetX = offsetX - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button2);

            return offsetX;
        }

        initThreeInlineX (): number {
            var offsetX = this.initTwoInlineX();
            var offsetY = this.game.height - this.padding;

            offsetX = offsetX - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);

            return offsetX;
        }

        initFourInlineX (): number {
            var offsetX = this.initThreeInlineX();
            var offsetY = this.game.height - this.padding;

            offsetX = offsetX - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);

            return offsetX;
        }

        initTwoInlineY (): number {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');

            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');

            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);

            return offsetY;
        }

        initThreeInlineY (): number {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initTwoInlineY();

            offsetY = offsetY - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);

            return offsetY;
        }

        initFourInlineY (): number {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initThreeInlineY();

            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);

            return offsetY;
        }

        initFourStack(): void {

            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');

            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');

            var offsetX = offsetX - this.buttonSize - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');

            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');

            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);

        }

        toRadians(angle: number): number {
            return angle * (Math.PI / 180);
        }

        toDegrees(angle: number): number {
            return angle * (180 / Math.PI);
        }

        initThreeFan(): void {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;

            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);

            //Button 1
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button1 = new Gamepads.Button(this.game, bx, by, 'button1');
            this.button1.sprite.scale.setTo(0.7);

            //Button 2
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);

            //Button 3
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);

            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);

        }


        initFourFan(): void {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;

            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);

            this.button1 = new Gamepads.Button(this.game, cx - this.padding, cy - this.padding, 'button1');
            this.button1.sprite.scale.setTo(1.2);

            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);

            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);

            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);

            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);

        }


        initFiveFan(): void {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 3;
            var angle = 175;

            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);

            this.button1 = new Gamepads.Button(this.game, cx, cy, 'button1');
            this.button1.sprite.scale.setTo(1.2);

            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);

            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);

            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);

            //Button 5
            bx = cx + Math.cos(angle + (angleStep * 3)) * radius;
            by = cy + Math.sin(angle + (angleStep * 3)) * radius;
            this.button5 = new Gamepads.Button(this.game, bx, by, 'button5');
            this.button5.sprite.scale.setTo(0.7);

            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
            this.game.add.plugin(this.button5);

        }

        static preloadAssets (game:Phaser.Game, assets_path:string): void {
            game.load.image('button1', assets_path + '/button1.png');
            game.load.image('button2', assets_path + '/button2.png');
            game.load.image('button3', assets_path + '/button3.png');
            game.load.image('button4', assets_path + '/button4.png');
            game.load.image('button5', assets_path + '/button5.png');
        }

    }
}