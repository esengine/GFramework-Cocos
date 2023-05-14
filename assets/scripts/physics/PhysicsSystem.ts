import { Vec2 } from "cc";
import { Quadtree } from "./Quadtree";
import { PositionComponent } from "../basic/component/PositionComponent";
import { ShapeComponent } from "../basic/component/ShapeComponent";
import { CollisionComponent } from "../basic/component/CollisionComponent";

export type CollisionPair = { entity1: gs.Entity, entity2: gs.Entity };

export class PhysicsSystem extends gs.System {
    private quadtree: Quadtree;
    private entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 };
    private collisions: CollisionPair[] = [];

    constructor(entityManager: gs.EntityManager) {
        super(entityManager, 0, gs.Matcher.empty().all(CollisionComponent));

        const entityToPositionAndSize = (entity) => {
            let positionComponent = entity.getComponent(PositionComponent);
            let shapeComponent = entity.getComponent(ShapeComponent);
            return {
                position: new Vec2(positionComponent.x, positionComponent.y),
                size: new Vec2(shapeComponent.width, shapeComponent.height)
            };
        };

        this.entityToPositionAndSize = entityToPositionAndSize;
        // 初始化四叉树
        this.quadtree = new Quadtree(10, this.entityToPositionAndSize);
    }

    entityFilter(entity: gs.Entity): boolean {
        return entity.hasComponent(CollisionComponent);
    }

    protected onComponentAdded<T extends gs.Component>(entity: gs.Entity, component: T): void {
        // 当一个新的实体被添加到系统中时，将它插入到四叉树中
        this.quadtree.insert(entity);
    }

    protected onComponentRemoved<T extends gs.Component>(entity: gs.Entity, component: T): void {
        // 当一个实体从系统中移除时，也将它从四叉树中移除
        this.quadtree.remove(entity);
    }

    update(entities: gs.Entity[]): void {
        // 在每次更新时，首先清空四叉树
        this.quadtree.clear();
        // 清空碰撞对数组
        this.collisions.length = 0;

        // 然后将所有的实体重新插入到四叉树中
        for (let entity of entities) {
            this.quadtree.insert(entity);
        }

        // 遍历所有的实体，查找碰撞对
        for (let entity of entities) {
            let others = this.quadtree.retrieve(entity);
            for (let other of others) {
                // 确保不重复检查同一对实体
                if (other.getId() < entity.getId()) {
                    continue;
                }
                // 检查实体是否真的相交
                if (this.isIntersecting(entity, other)) {
                    this.collisions.push({ entity1: entity, entity2: other });
                }
            }
        }

        // 处理所有的碰撞对
        for (let collision of this.collisions) {
            this.handleCollision(collision.entity1, collision.entity2);
        }
    }

    private isIntersecting(entity1: gs.Entity, entity2: gs.Entity): boolean {
        let entity1Position = entity1.getComponent(PositionComponent);
        let entity1Shape = entity1.getComponent(ShapeComponent);

        let entity2Position = entity2.getComponent(PositionComponent);
        let entity2Shape = entity2.getComponent(ShapeComponent);

        // 矩形碰撞检测
        return entity1Position.x < entity2Position.x + entity2Shape.width &&
            entity1Position.x + entity1Shape.width > entity2Position.x &&
            entity1Position.y < entity2Position.y + entity2Shape.height &&
            entity1Position.y + entity1Shape.height > entity2Position.y;
    }

    private handleCollision(entity1: gs.Entity, entity2: gs.Entity): void {
        // TODO: 实现处理碰撞的逻辑
        console.log(`${entity1.getId()} 与 ${entity2.getId()} 发生碰撞`);
    }
}