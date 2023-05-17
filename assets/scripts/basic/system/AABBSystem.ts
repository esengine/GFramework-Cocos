import { RenderComponent } from "../component/RenderComponent";

export class AABBSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(gs.physics.PhysicsComponent, RenderComponent));
    }

    update(entities: gs.Entity[]): void {
        for (const entity of entities) {
            const physics = entity.getComponent(gs.physics.PhysicsComponent);
            const render = entity.getComponent(RenderComponent);
            
            // 更新Cocos Creator游戏对象的位置
            render.node.setPosition(physics.aabb.minX, physics.aabb.minY);
        }
    }
}