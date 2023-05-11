import { PositionComponent } from "../component/PositionComponent";
import { ShapeComponent } from "../component/ShapeComponent";

export class CollisionSystem extends gs.System {
    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(PositionComponent, ShapeComponent));
    }

    protected onComponentAdded(entity: gs.Entity): void {
    }

    public update(entities: gs.Entity[]): void {
    }
}