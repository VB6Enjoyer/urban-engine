export interface IUpdateable {
    update(deltaTime: number, deltaFrame?: number): void;
}