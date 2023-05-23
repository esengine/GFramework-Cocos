import { _decorator, Canvas, Component, find, Node } from 'cc';
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

        this.core.systemManager.registerSystem(new MovementSystem(this.core.entityManager));
        this.core.systemManager.registerSystem(new RenderSystem(this.core.entityManager));

        this.core.registerPlugin(new gs.physics.World(new gs.physics.FixedPoint(0, -9.81), new gs.physics.FixedPoint(1, 60), 50));

        for (let i = 0; i < 5000; i ++) {
            const entity = this.core.entityManager.createEntity();
            const positionX = (Math.random() - 0.5) * 960;
            const positionY = (Math.random() - 0.5) * 640;
            const width = 10;
            const height = 10;
            entity.addComponent(gs.physics.Transform, positionX, positionY);
            entity.addComponent(gs.physics.BoxCollider, new gs.physics.Size(width, height));
            entity.addComponent(gs.physics.RigidBody);
            entity.addComponent(MovementComponent, Math.random() * 2 - 1, Math.random() * 2 - 1);
            entity.addComponent(RenderComponent, this.canvas, this.sprite);
        }

        // const entity = this.core.entityManager.createEntity();
        // const positionX = 0;
        // const positionY = 0;
        // const width = 10;
        // const height = 10;
        // entity.addComponent(gs.physics.Transform, positionX, positionY);
        // entity.addComponent(gs.physics.BoxCollider, new gs.physics.Size(width, height));
        // entity.addComponent(gs.physics.RigidBody);
        // entity.addComponent(MovementComponent, 0, 0);
        // entity.addComponent(RenderComponent, this.canvas, this.sprite);

        // const entity1 = this.core.entityManager.createEntity();
        // const positionX1 = 12;
        // const positionY1 = 12;
        // const width1 = 10;
        // const height1 = 10;
        // entity1.addComponent(gs.physics.Transform, positionX1, positionY1);
        // entity1.addComponent(gs.physics.BoxCollider, new gs.physics.Size(width1, height1));
        // entity1.addComponent(gs.physics.RigidBody);
        // entity1.addComponent(MovementComponent, 0, 0);
        // entity1.addComponent(RenderComponent, this.canvas, this.sprite);

        // const entity2 = this.core.entityManager.createEntity();
        // entity2.addComponent(gs.physics.Transform, 15, 15);
        // entity2.addComponent(gs.physics.BoxCollider, new gs.physics.Size(width1, height1));
        // entity2.addComponent(gs.physics.RigidBody);
        // entity2.addComponent(MovementComponent, 0, 0);
        // entity2.addComponent(RenderComponent, this.canvas, this.sprite);
        
        
    }

    update(deltaTime: number) {
        this.core.update(deltaTime);
    }
}

