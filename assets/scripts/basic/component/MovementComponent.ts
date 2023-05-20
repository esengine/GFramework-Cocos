export class MovementComponent extends gs.Component {
    public velocity: gs.physics.Vector2;

    onInitialize(velocityX: number, velocityY: number): void {
        this.velocity = new gs.physics.Vector2(velocityX, velocityY);
    }
}