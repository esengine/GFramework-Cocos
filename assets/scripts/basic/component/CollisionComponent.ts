import { PositionComponent } from "./PositionComponent";
import { ShapeComponent } from "./ShapeComponent";

export class CollisionComponent extends gs.Component {
    dependencies: gs.ComponentConstructor<gs.Component>[] = [
        PositionComponent,
        ShapeComponent
    ];
}