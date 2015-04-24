/**
 * Phaser joystick plugin.
 * Usage: In your preloader function call the static method preloadAssets. It will handle the preload of the necessary
 * assets. Then in the Stage in which you want to use the joystick, in the create method, instantiate the class and add such
 * object to the Phaser plugin manager (eg: this.game.plugins.add( myPlugin ))
 * Use the cursor.up / cursor.down / cursor.left / cursor.right methods to check for inputs
 * Use the speed dictionary to retrieve the input speed (if you are going to use an analog joystick)
 */
/// <reference path="../../lib/phaser.d.ts"/>


module Gamepads {

    export enum Sectors {
        HALF_LEFT = 1,
        HALF_TOP = 2,
        HALF_RIGHT = 3,
        HALF_BOTTOM = 4,
        TOP_LEFT = 5,
        TOP_RIGHT = 6,
        BOTTOM_RIGHT = 7,
        BOTTOM_LEFT = 8,
        ALL = 9
    }

    /**
     * @class Joystick
     * @extends Phaser.Plugin
     *
     * Implements a floating joystick for touch screen devices
     */
    export class Joystick extends Phaser.Plugin {

        //Private Properties
        game: Phaser.Game;

        private input: Phaser.Input;
        private imageGroup: Phaser.Sprite[] = [];
        private initialPoint: Phaser.Point;
        private doUpdate: boolean = false;
        private pointer: Phaser.Pointer;


        ////Public Properties
        public sector: Sectors;
        public gamepadMode: boolean = true;
        public settings: {

            maxDistanceInPixels:number;
            singleDirection:boolean;
            //Sets the pad to follow the finger movement
            float: boolean;
            //Sets the Plugin to interpolate the speed between 0 and topSpeed
            //If false always returns topSpeed
            analog: boolean;
            //Sets the top speed to be returned
            topSpeed: number
        };


        public cursors: {
            up:boolean;
            down:boolean;
            left:boolean;
            right:boolean
        };

        public speed: {
            x:number;
            y:number
        };

        constructor (game:Phaser.Game, sector: Sectors, gamepadMode: boolean = true) {

            super(game, new PIXI.DisplayObject());

            this.game = game;
            this.sector = sector;
            this.gamepadMode = gamepadMode;
            this.pointer = this.game.input.pointer1;

            //Setup the images
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_base'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_segment'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_knob'));

            this.imageGroup.forEach(function (e) {
                e.anchor.set(0.5);
                e.visible = false;
                e.fixedToCamera = true;
            });

            //Setup Default Settings
            this.settings = {
                maxDistanceInPixels: 60,
                singleDirection: false,
                float: true,
                analog: true,
                topSpeed: 200
            };

            //Setup Default State
            this.cursors = {
                up: false,
                down: false,
                left: false,
                right: false
            };

            this.speed = {
                x: 0,
                y: 0
            };

            this.inputEnable();

        }

        /**
         * @function inputEnable
         * enables the plugin actions
         */
        public inputEnable (): void {
            this.game.input.onDown.add(this.createStick, this);
            this.game.input.onUp.add(this.removeStick, this);
            this.active = true;
        }

        /**
         * @function inputDisable
         * disables the plugin actions
         */
        public inputDisable (): void {
            this.game.input.onDown.remove(this.createStick,this);
            this.game.input.onUp.remove(this.removeStick, this);
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

        /**
         * @function createStick
         * @param pointer
         *
         * visually creates the pad and starts accepting the inputs
         */
        private createStick (pointer: Phaser.Pointer): void {

            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if ( !this.inSector(pointer) ) return;

            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;

            this.imageGroup.forEach(function (e) {

                e.visible = true;
                e.bringToTop();

                e.cameraOffset.x = this.pointer.worldX;
                e.cameraOffset.y = this.pointer.worldY;

            }, this);

            //Allow updates on the stick while the screen is being touched
            this.doUpdate = true;

            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();
        }

        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        private removeStick (pointer: Phaser.Pointer): void {

            if (pointer.id != this.pointer.id) return;

            //Deny updates on the stick
            this.doUpdate = false;

            this.imageGroup.forEach(function(e){
                e.visible = false;
            });

            this.cursors.up = false;
            this.cursors.down = false;
            this.cursors.left = false;
            this.cursors.right = false;

            this.speed.x = 0;
            this.speed.y = 0;
        }

        /**
         * @function receivingInput
         * @returns {boolean}
         *
         * Returns true if any of the joystick "contacts" is activated
         */
        public receivingInput ():boolean {
            return (this.cursors.up || this.cursors.down || this.cursors.left || this.cursors.right);
        }

        /**
         * @function preUpdate
         * Performs the preUpdate plugin actions
         */
        preUpdate() {
            if (this.doUpdate){
                this.setDirection();
            }
        }


        private setSingleDirection(): void{

            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;

            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;

            if (d < maxDistanceInPixels) {
                this.cursors.up = false;
                this.cursors.down = false;
                this.cursors.left = false;
                this.cursors.right = false;

                this.speed.x = 0;
                this.speed.y = 0;

                this.imageGroup.forEach(function(e,i){
                    e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                    e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                }, this);

                return;
            };

            if (Math.abs(deltaX) > Math.abs(deltaY)){
                deltaY = 0;
                this.pointer.position.y = this.initialPoint.y;
            } else {
                deltaX = 0;
                this.pointer.position.x = this.initialPoint.x;
            }

            var angle = this.initialPoint.angle(this.pointer.position);


            if (d > maxDistanceInPixels){

                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;

                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;

                }
            }

            this.speed.x = Math.round( Math.cos(angle) * this.settings.topSpeed);
            this.speed.y = Math.round( Math.sin(angle) * this.settings.topSpeed);

            angle = angle * 180 / Math.PI;

            this.cursors.up = angle == -90;
            this.cursors.down = angle == 90;
            this.cursors.left = angle == 180;
            this.cursors.right = angle == 0;

            this.imageGroup.forEach(function(e,i){
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);

        }

        /**
         * @function setDirection
         * Main Plugin function. Performs the calculations and updates the sprite positions
         */
        private setDirection (): void {

            if (this.settings.singleDirection) {
                this.setSingleDirection();
                return;
            }

            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;

            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;

            if (!this.settings.analog) {

                if (d < maxDistanceInPixels) {
                    this.cursors.up = false;
                    this.cursors.down = false;
                    this.cursors.left = false;
                    this.cursors.right = false;

                    this.speed.x = 0;
                    this.speed.y = 0;

                    this.imageGroup.forEach(function (e, i) {
                        e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                        e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                    }, this);

                    return;
                }
            }

            var angle = this.initialPoint.angle(this.pointer.position);

            if (d > maxDistanceInPixels){

                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;

                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }

            if (this.settings.analog) {

                this.speed.x = Math.round(( deltaX/maxDistanceInPixels ) * this.settings.topSpeed);
                this.speed.y = Math.round(( deltaY/maxDistanceInPixels ) * this.settings.topSpeed);

            } else {

                this.speed.x = Math.round( Math.cos(angle) * this.settings.topSpeed);
                this.speed.y = Math.round( Math.sin(angle) * this.settings.topSpeed);
            }


            this.cursors.up = (deltaY < 0);
            this.cursors.down = (deltaY > 0);
            this.cursors.left = (deltaX < 0);
            this.cursors.right = (deltaX > 0);

            this.imageGroup.forEach(function(e,i){
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);


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