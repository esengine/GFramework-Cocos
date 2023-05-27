export class MovementSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(gs.physics.RigidBody));
    }
   
    public update(entities: gs.Entity[]): void {
        for (const entity of entities) {
            const rigidBody = entity.getComponent(gs.physics.RigidBody);

        }
    }
}