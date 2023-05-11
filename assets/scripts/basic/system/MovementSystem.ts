import { MovementComponent } from "../component/MovementComponent";
import { PositionComponent } from "../component/PositionComponent";
import { RenderComponent } from "../component/RenderComponent";

export class MovementSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(PositionComponent, MovementComponent, RenderComponent));
    }
   
    public update(entities: gs.Entity[]): void {
        const deltaTime = gs.TimeManager.getInstance().deltaTime;
        for (const entity of entities) {
            const position = entity.getComponent(PositionComponent);
            const movement = entity.getComponent(MovementComponent);
            const render = entity.getComponent(RenderComponent);

            // 更新位置
            position.x += movement.velocityX * deltaTime * 10;
            position.y += movement.velocityY * deltaTime * 10;
            
            // 更新Cocos Creator游戏对象的位置
            render.node.setPosition(position.x, position.y);
        }
    }
}