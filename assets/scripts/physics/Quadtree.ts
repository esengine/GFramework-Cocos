import { Vec2, screen } from "cc";
import { QuadtreeNode } from "./QuadtreeNode";


export class Quadtree {
    private root: QuadtreeNode;
    maxEntities: number;
    entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 };

    constructor(maxEntities: number, entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 }) {
        let initialCenter = new Vec2(screen.windowSize.x / 2 - screen.windowSize.x, screen.windowSize.y / 2 - screen.windowSize.y);
        let initialHalfDimension = new Vec2(screen.windowSize.x / 2, screen.windowSize.y / 2);
        this.root = new QuadtreeNode(initialCenter, initialHalfDimension, maxEntities, entityToPositionAndSize);
        this.maxEntities = maxEntities;
        this.entityToPositionAndSize = entityToPositionAndSize;
    }

    insert(entity: gs.Entity): void {
        // 检查实体是否在四叉树的边界内
        if (!this.root.isEntityInside(entity)) {
            // 如果不在，创建一个新的更大的四叉树
            let newRoot = this.expandRootForEntity(entity);
            this.root = newRoot;
        }

        // 插入实体
        this.insertHelper(entity, this.root);
    }

    expandRootForEntity(entity: gs.Entity): QuadtreeNode {
        let { position } = this.entityToPositionAndSize(entity);
    
        let newCenter = new Vec2(
            (this.root.topLeft.x + this.root.bottomRight.x) / 2,
            (this.root.topLeft.y + this.root.bottomRight.y) / 2
        );
    
        let oldHalfDimension = new Vec2(
            Math.abs(this.root.bottomRight.x - this.root.topLeft.x) / 2,
            Math.abs(this.root.bottomRight.y - this.root.topLeft.y) / 2
        );
    
        let newHalfDimension = oldHalfDimension.multiply2f(2, 2);
    
        let newRoot = new QuadtreeNode(newCenter, newHalfDimension, this.maxEntities, this.entityToPositionAndSize);
    
        // 将原来的四叉树作为新四叉树的一个子节点
        newRoot.children.push(this.root);
    
        return newRoot;
    }

    insertHelper(entity: gs.Entity, node: QuadtreeNode) {
        if (!node.isEntityInside(entity)) {
            return; // 实体不在节点边界内，直接返回
        }

        if (node.children.length !== 0) {
            for (let child of node.children) {
                this.insertHelper(entity, child);
            }
        } else {
            node.entities.push(entity);
        }

        // 在插入实体之前，先检查是否需要分裂
        if (node.entities.length >= this.maxEntities && node.isLeaf()) {
            node.split();
            for (let child of node.children) {
                for (let entity of node.entities) {
                    this.insertHelper(entity, child);
                }
            }
            node.entities = [];  // 清空父节点的实体列表
        }
    }

    retrieve(entity: gs.Entity): gs.Entity[] {
        let result: gs.Entity[] = [];
        this.retrieveHelper(entity, this.root, result);
        return result;
    }

    retrieveHelper(entity: gs.Entity, node: QuadtreeNode, result: gs.Entity[]) {
        if (node.children.length !== 0) {
            for (let child of node.children) {
                // 只有当子节点的边界与实体的边界相交时，才处理这个子节点
                if (child.isEntityInside(entity) || child.isIntersecting(entity)) {
                    this.retrieveHelper(entity, child, result);
                }
            }
        }

        result.push(...node.entities);
    }

    remove(entity: gs.Entity): void {
        this.removeHelper(entity, this.root);
    }

    removeHelper(entity: gs.Entity, node: QuadtreeNode): boolean {
        if (node.children.length !== 0) {
            for (let child of node.children) {
                if (child.isEntityInside(entity)) {
                    if (this.removeHelper(entity, child)) {
                        return true;
                    }
                }
            }
        }

        let index = node.entities.indexOf(entity);
        if (index !== -1) {
            node.entities.splice(index, 1);
            // 保持 spatialHash 更新
            if (node.spatialHash) {
                node.spatialHash.remove(entity);
            }
            return true;
        }

        return false;
    }

    clear(): void {
        this.clearHelper(this.root);
    }

    private clearHelper(node: QuadtreeNode): void {
        for (let child of node.children) {
            this.clearHelper(child);
        }
        node.entities = [];
        node.children = [];
        node.spatialHash.clear();
    }
}