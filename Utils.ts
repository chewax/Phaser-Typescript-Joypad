/// <reference path="../../lib/phaser.d.ts"/>

module Gamepads {

    export class PieMask extends Phaser.Graphics {

        public game:Phaser.Game;
        public radius:number;
        public rotation:number;
        public sides:number;
        public atRest:boolean = false;

        constructor(game:Phaser.Game, radius:number = 50, x:number = 0, y:number = 0, rotation:number = 0, sides:number = 6) {

            super(game, x/2, y/2);
            this.game = game;
            this.radius = radius;
            this.rotation = rotation;

            this.moveTo(this.x, this.y);

            if (sides < 3) this.sides = 3; // 3 sides minimum
            else this.sides = sides;
            this.game.add.existing(this);
        }

        public drawCircleAtSelf() {
            this.drawCircle(this.x, this.y, this.radius * 2);
        }

        public drawWithFill(pj:number, color:number = 0, alpha:number = 1) {
            this.clear();
            this.beginFill(color, alpha);
            this.draw(pj);
            this.endFill();
        }

        private lineToRadians(rads, radius) {
            this.lineTo(Math.cos(rads) * radius + this.x, Math.sin(rads) * radius + this.y);
        }

        public draw(pj:number) {
            // graphics should have its beginFill function already called by now
            this.moveTo(this.x, this.y);

            var radius = this.radius;

            // Increase the length of the radius to cover the whole target
            radius /= Math.cos(1 / this.sides * Math.PI);

            // Find how many sides we have to draw
            var sidesToDraw = Math.floor(pj * this.sides);
            for (var i = 0; i <= sidesToDraw; i++)
                this.lineToRadians((i / this.sides) * (Math.PI * 2) + this.rotation, radius);

            // Draw the last fractioned side
            if (pj * this.sides != sidesToDraw)
                this.lineToRadians(pj * (Math.PI * 2) + this.rotation, radius);
        }

    }
}