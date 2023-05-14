import { Vec2 } from "cc";

export class SpatialHash {
    private cellSize: number;
    private hashTable: Map<string, gs.Entity[]>;
    private entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 };

    constructor(cellSize: number, entityToPositionAndSize: (entity: gs.Entity) => { position: Vec2, size: Vec2 }) {
        this.cellSize = cellSize;
        this.hashTable = new Map();
        this.entityToPositionAndSize = entityToPositionAndSize;
    }

    private hash(position: Vec2): string {
        let cellX = Math.floor(position.x / this.cellSize);
        let cellY = Math.floor(position.y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    insert(entity: gs.Entity): void {
        const { position, size } = this.entityToPositionAndSize(entity);
        const halfSize = size.divide2f(2, 2);
        const topLeft = position.subtract(halfSize);
        const bottomRight = position.add(halfSize);

        const startCellX = Math.floor(topLeft.x / this.cellSize);
        const startCellY = Math.floor(topLeft.y / this.cellSize);
        const endCellX = Math.floor(bottomRight.x / this.cellSize);
        const endCellY = Math.floor(bottomRight.y / this.cellSize);

        for (let cellX = startCellX; cellX <= endCellX; cellX++) {
            for (let cellY = startCellY; cellY <= endCellY; cellY++) {
                let hash = `${cellX},${cellY}`;
                const cell = this.hashTable.get(hash);
                this.hashTable.set(hash, cell ? cell.concat(entity) : [entity]);
            }
        }
    }

    retrieve(entity: gs.Entity): gs.Entity[] {
        const { position, size } = this.entityToPositionAndSize(entity);
        const halfSize = size.divide2f(2, 2);
        const topLeft = position.subtract(halfSize);
        const bottomRight = position.add(halfSize);

        const startCellX = Math.floor(topLeft.x / this.cellSize);
        const startCellY = Math.floor(topLeft.y / this.cellSize);
        const endCellX = Math.floor(bottomRight.x / this.cellSize);
        const endCellY = Math.floor(bottomRight.y / this.cellSize);

        let result: gs.Entity[] = [];

        for (let cellX = startCellX; cellX <= endCellX; cellX++) {
            for (let cellY = startCellY; cellY <= endCellY; cellY++) {
                let hash = `${cellX},${cellY}`;
                const cell = this.hashTable.get(hash);
                if (cell) {
                    result.push(...cell);
                }
            }
        }

        return result;
    }

    remove(entity: gs.Entity): void {
        const { position, size } = this.entityToPositionAndSize(entity);
        const halfSize = size.divide2f(2, 2);
        const topLeft = position.subtract(halfSize);
        const bottomRight = position.add(halfSize);

        const startCellX = Math.floor(topLeft.x / this.cellSize);
        const startCellY = Math.floor(topLeft.y / this.cellSize);
        const endCellX = Math.floor(bottomRight.x / this.cellSize);
        const endCellY = Math.floor(bottomRight.y / this.cellSize);

        for (let cellX = startCellX; cellX <= endCellX; cellX++) {
            for (let cellY = startCellY; cellY <= endCellY; cellY++) {
                let hash = `${cellX},${cellY}`;
                if (this.hashTable.has(hash)) {
                    let cell = this.hashTable.get(hash);
                    let index = cell.indexOf(entity);
                    if (index !== -1) {
                        cell.splice(index, 1);
                    }
                    if (cell.length === 0) {
                        this.hashTable.delete(hash);
                    }
                }
            }
        }
    }

    clear(): void {
        this.hashTable.clear();
    }
}