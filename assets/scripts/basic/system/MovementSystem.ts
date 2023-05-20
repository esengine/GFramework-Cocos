import { MovementComponent } from "../component/MovementComponent";

export class MovementSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(MovementComponent, gs.physics.Transform));
    }
   
    public update(entities: gs.Entity[]): void {
        for (const entity of entities) {
            const transform = entity.getComponent(gs.physics.Transform);
            const movement = entity.getComponent(MovementComponent);

            transform.position = transform.position.add(movement.velocity);
        }
    }
}