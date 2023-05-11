export class ShapeComponent extends gs.Component {
    public width: number;
    public height: number;

    onInitialize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}