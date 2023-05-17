import { MovementComponent } from "../component/MovementComponent";
import { PositionComponent } from "../component/PositionComponent";

export class MovementSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(gs.physics.PhysicsComponent, PositionComponent, MovementComponent));
    }
   
    public update(entities: gs.Entity[]): void {
        const deltaTime = gs.TimeManager.getInstance().deltaTime;
        for (const entity of entities) {
            const movement = entity.getComponent(MovementComponent);
            const position = entity.getComponent(PositionComponent);
            const physics = entity.getComponent(gs.physics.PhysicsComponent);
            
            var velocityX = movement.velocityX * deltaTime * 10;
            var velocityY = movement.velocityY * deltaTime * 10;

            // 更新位置
            position.x += velocityX;
            position.y += velocityY;
            
            physics.aabb.velocityX = velocityX;
            physics.aabb.velocityY = velocityY;
        }
    }
}