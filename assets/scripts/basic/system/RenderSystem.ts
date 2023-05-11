import { Color } from "cc";
import { PositionComponent } from "../component/PositionComponent";
import { RenderComponent } from "../component/RenderComponent";
import { ShapeComponent } from "../component/ShapeComponent";

export class RenderSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(PositionComponent, ShapeComponent, RenderComponent))
    }

    protected onComponentAdded(entity: gs.Entity): void {
        console.log(`组件添加 ${entity.getId()}`);
    }

    update(entities: gs.Entity[]): void {
    }
}