/// <reference path="../../lib/phaser.d.ts"/>

module Gamepads {

    export enum ButtonType {
        SINGLE = 1,
        TURBO = 2,
        DELAYED_TURBO = 3,
        SINGLE_THEN_TURBO = 4,
        CUSTOM = 5
    }

    export class Button extends Phaser.Plugin {

        game: Phaser.Game;
        sprite: Phaser.Sprite;
        width: number;
        height: number;
        pressed: boolean = false;
        onPressedCallback: Function;
        type: ButtonType;
        timerId: number;

        constructor (game: Phaser.Game, x:number, y:number, key:string, onPressedCallback?: Function, listenerContext?: any,
            type: ButtonType = ButtonType.SINGLE_THEN_TURBO, width?:number, height?:number) {

            super(game, new PIXI.DisplayObject() );

            this.game = game;
            this.type = type;
            this.sprite = this.game.add.sprite(x, y, key);
            this.width = width || this.sprite.width;
            this.height = height || this.sprite.height;
            this.sprite.inputEnabled = true;

            if ( onPressedCallback == undefined ) {
                this.onPressedCallback = this.empty;
            } else {
                this.onPressedCallback = onPressedCallback.bind(listenerContext);
            }

            this.sprite.events.onInputDown.add(this.pressButton, this);
            this.sprite.events.onInputUp.add(this.releaseButton, this);
            this.sprite.anchor.setTo(1,1);
            this.active = true;

        }

        empty (): void {

        }

        pressButton(){
            switch (this.type){

                case ButtonType.SINGLE:
                    this.onPressedCallback();
                    break;

                case ButtonType.TURBO:
                    this.pressed = true;
                    break;

                case ButtonType.DELAYED_TURBO:
                    this.timerId = setTimeout(function(){
                        this.pressed = true;
                    }.bind(this), 300);
                    break;

                case ButtonType.SINGLE_THEN_TURBO:
                    this.onPressedCallback();
                    this.timerId = setTimeout(function(){
                        this.pressed = true;
                    }.bind(this), 300);
                    break;

                default:
                    this.pressed = true;
            }
        }

        releaseButton(){
            this.pressed = false;
            clearTimeout(this.timerId);
        }

        setOnPressedCallback(listener: Function, listenerContext: any): void{
            this.onPressedCallback = listener.bind(listenerContext);
        }

        update() {
            //If it is custom, we assume the programmer will check for the state in his own update,
            //we just set the state to pressed
            if (this.pressed && this.type != ButtonType.CUSTOM) {
                this.onPressedCallback();
            }
        }

    }
}