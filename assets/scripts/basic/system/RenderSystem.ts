import { Color } from "cc";
import { RenderComponent } from "../component/RenderComponent";

export class RenderSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(gs.physics.Transform, gs.physics.Collider, RenderComponent))
    }

    protected onComponentAdded(entity: gs.Entity): void {
        // console.log(`组件添加 ${entity.getId()}`);
    }

    update(entities: gs.Entity[]): void {
        for (const entity of entities) {
            const render = entity.getComponent(RenderComponent);
            const transform = entity.getComponent(gs.physics.Transform);
            const colider = entity.getComponent(gs.physics.Collider);
            render.node.setPosition(transform.position.x.toFloat(), transform.position.y.toFloat());
            render.sprite.color = colider.isColliding ? new Color(0, 255, 0, 120) : new Color(255, 0, 0, 120);
        }
    }
}