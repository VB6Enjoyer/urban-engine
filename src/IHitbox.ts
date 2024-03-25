import { Rectangle } from "pixi.js";

export interface IHitbox {
    getHitbox(): Rectangle;
}

export function checkCollision(objA: IHitbox, objB: IHitbox): boolean {
    const rA = objA.getHitbox();
    const rB = objB.getHitbox();

    const bottommostTop = rA.top < rB.top ? rB.top : rA.top;
    const topmostBottom = rA.bottom > rB.bottom ? rB.bottom : rA.bottom;

    return bottommostTop < topmostBottom;
}