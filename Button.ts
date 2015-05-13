/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Utils.ts"/>

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
        cooldown: {enabled:boolean; seconds:number; timer:number};

        constructor (game: Phaser.Game, x:number, y:number, key:string, onPressedCallback?: Function, listenerContext?: any,
            type: ButtonType = ButtonType.SINGLE_THEN_TURBO, width?:number, height?:number) {

            super(game, new PIXI.DisplayObject() );

            this.game = game;
            this.type = type;
            this.sprite = this.game.add.sprite(x, y, key);

            this.width = width || this.sprite.width;
            this.height = height || this.sprite.height;
            this.sprite.inputEnabled = true;

            this.cooldown = {
                enabled: false,
                seconds: 0,
                timer: 0
            };

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

        enableCooldown(seconds:number){
            this.cooldown.enabled = true;
            this.cooldown.seconds = seconds;
            this.cooldown.timer = this.game.time.time;

            var mask_x = this.sprite.x - (this.sprite.width / 2);
            var mask_y = this.sprite.y - (this.sprite.height / 2);
            var mask_radius = Math.max(this.sprite.width,this.sprite.height)/2;
            this.sprite.mask = new Superhero.PieMask(this.game, mask_radius, mask_x, mask_y);
        }

        disableCooldown(){
            this.cooldown.enabled = false;
            (<Superhero.PieMask> this.sprite.mask).drawCircleAtSelf();
            (<Superhero.PieMask> this.sprite.mask).atRest = true;
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

            if (this.cooldown.enabled) {
                var elapsed = this.game.time.elapsedSecondsSince(this.cooldown.timer);
                var cooldown = this.cooldown.seconds;

                if (elapsed > cooldown) {

                    if (this.pressed) {
                        this.cooldown.timer = this.game.time.time;
                        if (this.type != ButtonType.CUSTOM){
                            this.onPressedCallback();
                        }
                    }

                    if (!(<Superhero.PieMask> this.sprite.mask).atRest) {
                        (<Superhero.PieMask> this.sprite.mask).drawCircleAtSelf();
                        (<Superhero.PieMask> this.sprite.mask).atRest = true;
                    }

                    return;
                }

                var pj = elapsed / cooldown;
                (<Superhero.PieMask> this.sprite.mask).drawWithFill(pj, 0xFFFFFF, 1);
                (<Superhero.PieMask> this.sprite.mask).atRest = false;

            } else {

                //If it is custom, we assume the programmer will check for the state in his own update,
                //we just set the state to pressed
                if (this.pressed) {
                    this.cooldown.timer = this.game.time.time;
                    if (this.type != ButtonType.CUSTOM){
                        this.onPressedCallback();
                    }
                }

            }


        }

    }
}