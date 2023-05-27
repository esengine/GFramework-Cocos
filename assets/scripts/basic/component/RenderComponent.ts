import { BoxCollider, Color, Graphics, Node, instantiate, math } from "cc";

export class RenderComponent extends gs.Component {
    node: Node;
    sprite: Graphics;
    collider: gs.physics.Collider;
    isColliding: boolean;

    onInitialize(scene: Node, sprite: Node): void {
        this.node = instantiate(sprite);
        this.node.setParent(scene);
        this.node.active = true;
        this.sprite = this.node.getComponent(Graphics);
        this.collider = this.entity.getComponent(gs.physics.Collider);
        if (this.collider instanceof gs.physics.BoxCollider) {
            const bounds = this.collider.getBounds() as gs.physics.BoxBounds;
            this.sprite.fillRect(0, 0, bounds.width.toFloat(), bounds.height.toFloat());
            this.sprite.fillColor = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
            this.sprite.fill();
        }
    }
}