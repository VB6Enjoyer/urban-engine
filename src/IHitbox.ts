import { Rectangle } from "pixi.js";

export interface IHitbox {
    getHitbox(): Rectangle;
}

export function checkCollision(objA: IHitbox, objB: IHitbox): boolean {
    const rA = objA.getHitbox();
    const rB = objB.getHitbox();

    const bottommostTop = rA.top < rB.top ? rB.top : rA.top; // Highest point among the bottom edges of objA and objB.
    const topmostBottom = rA.bottom > rB.bottom ? rB.bottom : rA.bottom; // Lowest point among the top edges of objA and objB.

    return bottommostTop < topmostBottom;
}