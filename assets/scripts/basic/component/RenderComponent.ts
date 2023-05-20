import { Color, Contact2DType, ICollisionEvent, Node, RigidBody2D, Sprite, instantiate, math } from "cc";

export class RenderComponent extends gs.Component {
    node: Node;
    sprite: Sprite;

    onInitialize(scene: Node, sprite: Node): void {
        this.node = instantiate(sprite);
        this.node.setParent(scene);
        this.node.active = true;
        this.sprite = this.node.getComponent(Sprite);
        this.sprite.color = new Color(255, 0, 0, 120);
    }
}