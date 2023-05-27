import { Color } from "cc";
import { RenderComponent } from "../component/RenderComponent";

export class RenderSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(gs.physics.Transform, gs.physics.Collider, RenderComponent))
    }

    protected onComponentAdded(entity: gs.Entity): void {
        const collider = entity.getComponent(gs.physics.Collider);
        const render = entity.getComponent(RenderComponent);

        // if (collider != null && render != null) {
        //     collider.onCollisionEnter = this.onCollisionEnter.bind(this, render);
        //     collider.onCollisionExit = this.onCollisionExit.bind(this, render);
        // }
    }

    update(entities: gs.Entity[]): void {
        for (const entity of entities) {
            const render = entity.getComponent(RenderComponent);
            const transform = entity.getComponent(gs.physics.Transform);
            render.node.setPosition(transform.position.x.toFloat(), transform.position.y.toFloat());
        }
    }

    onCollisionEnter(render: RenderComponent): void {
        render.isColliding = true;
        render.sprite.fillColor = new Color(0, 180, 0, 255);
        render.sprite.fill();
    }

    onCollisionExit(render: RenderComponent): void {
        render.isColliding = false;
        render.sprite.fillColor = new Color(180, 0, 0, 255);
        render.sprite.fill();
    }
}