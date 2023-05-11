import { Color, Node, Sprite, instantiate, math } from "cc";
import { PositionComponent } from "./PositionComponent";
import { ShapeComponent } from "./ShapeComponent";

export class RenderComponent extends gs.Component {
    node: Node;

    dependencies: gs.ComponentConstructor<gs.Component>[] = [
        PositionComponent,
        ShapeComponent
    ];

    onInitialize(scene: Node, sprite: Node): void {
        this.node = instantiate(sprite);
        this.node.setParent(scene);
        this.node.active = true;
        const s = this.node.getComponent(Sprite);
        s.color = new Color(math.random() * 255, math.random() * 255, math.random() * 255, 120);
    }
}