import { _decorator, Canvas, Component, find, Node } from 'cc';
import { MovementComponent } from './component/MovementComponent';
import { PositionComponent } from './component/PositionComponent';
import { ShapeComponent } from './component/ShapeComponent';
import { RenderComponent } from './component/RenderComponent';
import { MovementSystem } from './system/MovementSystem';
import { CollisionSystem } from './system/CollisionSystem';
import { RenderSystem } from './system/RenderSystem';
import { CollisionComponent } from './component/CollisionComponent';
import { AABBSystem } from './system/AABBSystem';
const { ccclass, property } = _decorator;

@ccclass('BasicCore')
export class BasicCore extends Component {
    private entityManager: gs.EntityManager;
    private systemManager: gs.SystemManager;
    private timeManager: gs.TimeManager;

    private canvas: Node;
    private sprite: Node;

    start() {
        this.entityManager = new gs.EntityManager();
        this.systemManager = new gs.SystemManager(this.entityManager);
        this.timeManager = gs.TimeManager.getInstance();
        this.canvas = find('Canvas');
        this.sprite = find('SpriteSplash', this.canvas);

        this.systemManager.registerSystem(new MovementSystem(this.entityManager));
        this.systemManager.registerSystem(new CollisionSystem(this.entityManager));
        this.systemManager.registerSystem(new RenderSystem(this.entityManager));
        const rectangle = new gs.physics.Rectangle(-480, -320, 960, 640);
        this.systemManager.registerSystem(new gs.physics.PhysicsSystem(this.entityManager, rectangle));
        this.systemManager.registerSystem(new AABBSystem(this.entityManager));

        // for (let i = 0; i < 2000; i ++) {
        //     const entity = this.entityManager.createEntity();
        //     const positionX = (Math.random() - 0.5) * 960;
        //     const positionY = (Math.random() - 0.5) * 640;
        //     const width = 10;
        //     const height = 10;
        //     entity.addComponent(PositionComponent, positionX, positionY);
        //     entity.addComponent(MovementComponent, Math.random() * 2 - 1, Math.random() * 2 - 1);
        //     entity.addComponent(ShapeComponent, width, height);
        //     entity.addComponent(RenderComponent, this.canvas, this.sprite);
        //     entity.addComponent(CollisionComponent);
        //     entity.addComponent(gs.physics.PhysicsComponent, new gs.physics.AABB(positionX, positionY, width, height));
        // }

        const entity = this.entityManager.createEntity();
        const positionX = 0;
        const positionY = 0;
        const width = 10;
        const height = 10;
        entity.addComponent(PositionComponent, positionX, positionY);
        // entity.addComponent(MovementComponent, Math.random() * 2 - 1, Math.random() * 2 - 1);
        entity.addComponent(ShapeComponent, width, height);
        entity.addComponent(RenderComponent, this.canvas, this.sprite);
        entity.addComponent(CollisionComponent);
        entity.addComponent(gs.physics.PhysicsComponent, new gs.physics.AABB(positionX, positionY, width, height));

        const entity1 = this.entityManager.createEntity();
        const positionX1 = 5;
        const positionY1 = 5;
        const width1 = 10;
        const height1 = 10;
        entity1.addComponent(PositionComponent, positionX1, positionY1);
        // entity.addComponent(MovementComponent, Math.random() * 2 - 1, Math.random() * 2 - 1);
        entity1.addComponent(ShapeComponent, width1, height1);
        entity1.addComponent(RenderComponent, this.canvas, this.sprite);
        entity1.addComponent(CollisionComponent);
        entity1.addComponent(gs.physics.PhysicsComponent, new gs.physics.AABB(positionX1, positionY1, width1, height1));
    }

    update(deltaTime: number) {
        this.timeManager.update(deltaTime);
        this.systemManager.update();
    }
}

