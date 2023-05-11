export class PositionComponent extends gs.Component {
    public x: number;
    public y: number;

    onInitialize(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}