/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>


module Gamepads {

    export enum TouchInputType {
        TOUCH = 1,
        SWIPE = 2,
    }


    export class TouchInput extends Phaser.Plugin {

        //Private Properties
        game: Phaser.Game;

        private initialPoint: Phaser.Point;
        private pointer: Phaser.Pointer;

        public swipeUpCallback: Function;
        public swipeDownCallback: Function;
        public swipeLeftCallback: Function;
        public swipeRightCallback: Function;
        public onTouchDownCallback: Function;
        public onTouchReleaseCallback(time: number): Function;

        ////Public Properties
        public sector: Sectors;
        public touchType: TouchInputType;
        public screenPressed: boolean = false;
        public touchTimer: number;
        public swipeThreshold: number = 100;

        public swipe: {
            up:boolean;
            down:boolean;
            left:boolean;
            right:boolean
        };

        constructor (game:Phaser.Game, sector: Sectors, type: TouchInputType = TouchInputType.SWIPE ) {

            super(game, new PIXI.DisplayObject());

            this.game = game;
            this.sector = sector;
            this.touchType = type;
            this.pointer = this.game.input.pointer1;


            this.swipeDownCallback = this.empty;
            this.swipeLeftCallback = this.empty;
            this.swipeRightCallback = this.empty;
            this.swipeUpCallback = this.empty;
            this.onTouchDownCallback = this.empty;
            this.onTouchReleaseCallback = this.empty;

            //Setup Default State
            this.swipe = {
                up: false,
                down: false,
                left: false,
                right: false
            };

            this.inputEnable();

        }


        public inputEnable (): void {

            this.game.input.onDown.add(this.startGesture , this);
            this.game.input.onUp.add(this.endGesture, this);
            this.active = true;
        }


        public inputDisable (): void {

            this.game.input.onDown.remove(this.startGesture ,this);
            this.game.input.onUp.remove(this.endGesture, this);
            this.active = false;
        }

        private inSector (pointer: Phaser.Pointer): boolean {

            var half_bottom = pointer.position.y > this.game.height / 2;
            var half_top    = pointer.position.y < this.game.height / 2;
            var half_right  = pointer.position.x > this.game.width  / 2;
            var half_left   = pointer.position.x < this.game.width  / 2;

            if (this.sector == Sectors.ALL) return true;
            if (this.sector == Sectors.HALF_LEFT && half_left) return true;
            if (this.sector == Sectors.HALF_RIGHT && half_right) return true;
            if (this.sector == Sectors.HALF_BOTTOM && half_bottom) return true;
            if (this.sector == Sectors.HALF_TOP && half_top) return true;
            if (this.sector == Sectors.TOP_LEFT && half_top && half_left) return true;
            if (this.sector == Sectors.TOP_RIGHT && half_top && half_right) return true;
            if (this.sector == Sectors.BOTTOM_RIGHT && half_bottom && half_right) return true;
            if (this.sector == Sectors.BOTTOM_LEFT && half_bottom && half_left) return true;

            return false;
        }


        private startGesture (pointer: Phaser.Pointer): void {

            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if ( !this.inSector(pointer) ) return;

            this.touchTimer = this.game.time.time;
            this.screenPressed = true;

            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;
            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();

            if (this.touchType == TouchInputType.TOUCH) {
                this.onTouchDownCallback();
            }
        }

        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        private endGesture (pointer: Phaser.Pointer): void {

            if (pointer.id != this.pointer.id) return;

            this.screenPressed = false;
            var elapsedTime = this.game.time.elapsedSecondsSince(this.touchTimer);

            console.log(elapsedTime);

            if (this.touchType == TouchInputType.TOUCH) {
                this.onTouchReleaseCallback(elapsedTime);
                return;
            }

            var d = this.initialPoint.distance(this.pointer.position);
            if (d < this.swipeThreshold ) return;

            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;

            if (Math.abs(deltaX) > Math.abs(deltaY)){
                this.pointer.position.y = this.initialPoint.y;
            } else {
                this.pointer.position.x = this.initialPoint.x;
            }

            var angle = this.initialPoint.angle(this.pointer.position);
            angle = angle * 180 / Math.PI;

            this.swipe.up = angle == -90;
            this.swipe.down = angle == 90;
            this.swipe.left = angle == 180;
            this.swipe.right = angle == 0;

            console.log(this.swipe);

            if (this.swipe.up) this.swipeUpCallback();
            if (this.swipe.down) this.swipeDownCallback();
            if (this.swipe.left) this.swipeLeftCallback();
            if (this.swipe.right) this.swipeRightCallback();
        }


        empty (par ?: any): void {

        }


        /**
         * @function preloadAssets
         * @static
         * @param game {Phaser.Game} - An instance of the current Game object
         * @param assets_path {String} - A relative path to the assets directory
         *
         * Static class that preloads all the necesary assets for the joystick. Should be called on the game
         * preload method
         */
        static preloadAssets (game:Phaser.Game, assets_path:string): void {

            game.load.image('joystick_base', assets_path + '/joystick_base.png');
            game.load.image('joystick_segment', assets_path + '/joystick_segment.png');
            game.load.image('joystick_knob', assets_path + '/joystick_knob.png');

        }

    }
}
