import { Container, Point } from "pixi.js";

export class PhysicsContainer extends Container {

    public speed: Point = new Point();
    public acceleration: Point = new Point();

    public update(deltaSeconds: number) {
        this.x += this.speed.x * deltaSeconds + (1 / 2) * this.acceleration.x * Math.pow(deltaSeconds, 2);
        this.y += this.speed.y * deltaSeconds + (1 / 2) * this.acceleration.y * Math.pow(deltaSeconds, 2);

        this.speed.x += this.acceleration.x * deltaSeconds;
        this.speed.y += this.acceleration.y * deltaSeconds;
    }
}