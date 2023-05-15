import { Vec2 } from "cc";
import { SpatialHash } from "./SpatialHash";

export class QuadtreeNode {
    topLeft: Vec2;
    bottomRight: Vec2;
    entities: gs.Entity[];
    children: QuadtreeNode[];
    maxEntities: number;
    spatialHash: SpatialHash;
    entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 };

    constructor(topLeft: Vec2, bottomRight: Vec2, maxEntities: number = 5, entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 }) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        this.entities = [];
        this.children = [];
        this.maxEntities = maxEntities;
        this.entityToPositionAndSize = entityToPositionAndSize;
        this.spatialHash = new SpatialHash(10, entityToPositionAndSize);
    }

    isLeaf(): boolean {
        return this.children.length === 0;
    }

    /**
     * 是否在该节点的边界内
     * @param entity 
     */
    isEntityInside(entity: gs.Entity): boolean {
        let { position, size } = this.entityToPositionAndSize(entity);
        let halfSize = size.divide2f(2, 2);

        const isInsideX = position.x - halfSize.x >= this.topLeft.x && position.x + halfSize.x <= this.bottomRight.x;
        const isInsideY = position.y - halfSize.y >= this.topLeft.y && position.y + halfSize.y <= this.bottomRight.y;

        return isInsideX && isInsideY;
    }

    /**
     * 检查实体的边界是否与节点的边界相交
     * @param entity 
     */
    isIntersecting(entity: gs.Entity): boolean {
        let { position, size } = this.entityToPositionAndSize(entity);
        let halfSize = size.divide2f(2, 2);

        // 实体的边界
        let entityLeft = position.x - halfSize.x;
        let entityRight = position.x + halfSize.x;
        let entityTop = position.y + halfSize.y;
        let entityBottom = position.y - halfSize.y;

        // 节点的边界
        let nodeLeft = this.topLeft.x;
        let nodeRight = this.bottomRight.x;
        let nodeTop = this.bottomRight.y;
        let nodeBottom = this.topLeft.y;

        // 如果实体的边界与节点的边界相交，返回 true
        return entityLeft < nodeRight && entityRight > nodeLeft &&
            entityTop > nodeBottom && entityBottom < nodeTop;
    }

    insert(entity: gs.Entity): void {
        if (this.isEntityInside(entity)) {
            this.spatialHash.insert(entity);
            this.entities.push(entity);

            if (this.entities.length > this.maxEntities) {
                this.split();
            }
        }
    }

    retrieve(entity: gs.Entity): gs.Entity[] {
        if (this.isEntityInside(entity)) {
            return this.spatialHash.retrieve(entity);
        }
        return [];
    }

    remove(entity: gs.Entity): boolean {
        if (this.isEntityInside(entity)) {
            this.spatialHash.remove(entity);
            const index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    split(): void {
        // 将此节点分裂为四个子节点
        this.createChildren();

        // 将实体分配到子节点中
        this.distributeEntities();
    }

    createChildren(): void {
        let width = this.bottomRight.x - this.topLeft.x;
        let height = this.bottomRight.y - this.topLeft.y;

        let halfWidth = width / 2;
        let halfHeight = height / 2;

        this.children.push(new QuadtreeNode(this.topLeft, new Vec2(this.topLeft.x + halfWidth, this.topLeft.y + halfHeight), this.maxEntities, this.entityToPositionAndSize));
        this.children.push(new QuadtreeNode(new Vec2(this.topLeft.x + halfWidth, this.topLeft.y), new Vec2(this.bottomRight.x, this.topLeft.y + halfHeight), this.maxEntities, this.entityToPositionAndSize));
        this.children.push(new QuadtreeNode(new Vec2(this.topLeft.x, this.topLeft.y + halfHeight), new Vec2(this.topLeft.x + halfWidth, this.bottomRight.y), this.maxEntities, this.entityToPositionAndSize));
        this.children.push(new QuadtreeNode(new Vec2(this.topLeft.x + halfWidth, this.topLeft.y + halfHeight), this.bottomRight, this.maxEntities, this.entityToPositionAndSize));
    }

    distributeEntities(): void {
        for (let entity of this.entities) {
            for (let child of this.children) {
                if (child.isEntityInside(entity)) {
                    child.insert(entity);
                }
            }
        }
    }
}