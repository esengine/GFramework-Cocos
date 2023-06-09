import { _decorator, Canvas, Component, find, Node, Vec2 } from 'cc';
import { MovementComponent } from './component/MovementComponent';
import { RenderComponent } from './component/RenderComponent';
import { MovementSystem } from './system/MovementSystem';
import { RenderSystem } from './system/RenderSystem';
const { ccclass, property } = _decorator;

@ccclass('BasicCore')
export class BasicCore extends Component {
    private core: gs.Core;

    private canvas: Node;
    private sprite: Node;

    start() {
        this.core = gs.Core.instance;
        this.canvas = find('Canvas');
        this.sprite = find('SpriteSplash', this.canvas);

        // this.core.systemManager.registerSystem(new MovementSystem(this.core.entityManager));
        this.core.systemManager.registerSystem(new RenderSystem(this.core.entityManager));

        this.core.registerPlugin(new gs.physics.World(new gs.physics.FixedPoint(0, -9.81), new gs.physics.FixedPoint(1 / 60)));

        for (let i = 0; i < 1000; i ++) {
            const entity = this.core.entityManager.createEntity();
            const positionX = (Math.random() - 0.5) * 960;
            const positionY = (Math.random() - 0.5) * 640;
            const width = 10;
            const height = 10;
            entity.addComponent(gs.physics.Transform, positionX, positionY);
            entity.addComponent(gs.physics.BoxCollider, new gs.physics.Size(width, height));
            entity.addComponent(gs.physics.RigidBody).applyForce(new gs.physics.Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).mul(120));
            entity.addComponent(RenderComponent, this.canvas, this.sprite);
        }
    }

    update(deltaTime: number) {
        this.core.update(deltaTime);
    }
}

