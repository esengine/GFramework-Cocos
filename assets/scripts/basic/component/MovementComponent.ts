export class MovementComponent extends gs.Component {
    public velocityX: number;
    public velocityY: number;

    onInitialize(velocityX: number, velocityY: number): void {
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
}