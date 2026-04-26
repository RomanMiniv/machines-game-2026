import { Scene, Types } from "phaser";

export type ChunkType = "ground" | "oil" | "robot" | "drone" | "empty";

export interface ILevelChunk {
  id: number;
  items: ILevelItem[];
}

export interface ILevelItem {
  type: ChunkType;
  pos: Types.Math.Vector2Like;
  amount?: number;
  step?: Types.Math.Vector2Like;
  scale?: Types.Math.Vector2Like;
}

export interface IEntityBuilder {
  createGround(pos: Types.Math.Vector2Like, scale?: Types.Math.Vector2Like): void;
  createOil(pos: Types.Math.Vector2Like): void;
  createRobot(pos: Types.Math.Vector2Like): void;
  createDrone(pos: Types.Math.Vector2Like): void;
}

export class LevelManager {
  scene: Scene;
  entityBuilder: IEntityBuilder;

  levelTemplate: ILevelChunk[];
  chunkSize: number;
  private _spawnedChunks = new Set<number>();
  private readonly _amountClosestVisibleChunks: number = 2;

  private _currentChunkIndex: number = 0;
  get currentChunkIndex() {
    return this._currentChunkIndex;
  }

  constructor(scene: Scene, entityBuilder: IEntityBuilder) {
    this.scene = scene;
    this.entityBuilder = entityBuilder;

    this.chunkSize = this.scene.scale.width;

    this.init();
  }

  init(): void {
    const { width, height } = this.scene.scale;
    this.levelTemplate = [
      {
        id: 0,
        items: [
          { type: "ground", pos: { x: 0, y: height }, amount: 6, step: { x: 300, y: 0 } },
          { type: "ground", pos: { x: 1800, y: height }, amount: 1, scale: { x: .4, y: 1 } },
        ],
      },
      {
        id: 1,
        items: [
          { type: "ground", pos: { x: 0, y: height }, amount: 3, step: { x: 300, y: 0 } },
          { type: "ground", pos: { x: 1200, y: height }, amount: 1 },
          { type: "ground", pos: { x: 1800, y: height }, amount: 1, scale: { x: .4, y: 1 } },
          
          { type: "oil", pos: { x: 1860, y: height - 300 }, amount: 1 },
        ],
      },
      {
        id: 2,
        items: [
          { type: "ground", pos: { x: 0, y: height }, amount: 1 },

          { type: "oil", pos: { x: 150, y: height - 300 }, amount: 1 },

          { type: "ground", pos: { x: 900, y: height }, amount: 1 },
          { type: "ground", pos: { x: 1500, y: height }, amount: 1 },
          { type: "ground", pos: { x: 1800, y: height }, amount: 1, scale: { x: .4, y: 1 } },
          // { type: "oil", pos: { x: 1000, y: 600 }, amount: 2, step: { x: 200, y: 0 } },
          { type: "robot", pos: { x: 1000, y: 600 }, amount: 2, step: { x: 200, y: 0 } },
        ],
      },
      {
        id: 3,
        items: [
          { type: "ground", pos: { x: 0, y: height }, amount: 5, step: { x: 300, y: 0 } },
          { type: "ground", pos: { x: 300, y: height - 150 }, amount: 4, step: { x: 300, y: 0 } },
          { type: "ground", pos: { x: 600, y: height - 150 * 2 }, amount: 3, step: { x: 300, y: 0 } },
          { type: "ground", pos: { x: 900, y: height - 150 * 3 }, amount: 2, step: { x: 300, y: 0 } },
          { type: "ground", pos: { x: 1200, y: height - 150 * 4 }, amount: 1 },

          { type: "drone", pos: { x: 1650, y: height - 150 * 6 }, amount: 1 },
          // { type: "oil", pos: { x: 1000, y: 600 }, amount: 2, step: { x: 200, y: 0 } },
        ],
      },
      {
        id: 4,
        items: [
          { type: "ground", pos: { x: 0, y: height }, amount: 5, step: { x: 0, y: -150 } },
          { type: "ground", pos: { x: 600, y: height }, amount: 4, step: { x: 0, y: -150 } },
          { type: "ground", pos: { x: 1200, y: height }, amount: 3, step: { x: 0, y: -150 } },
          { type: "ground", pos: { x: 1800, y: height }, amount: 1, scale: { x: .4, y: 1 } },
        ],
      },
      {
        id: 5,
        items: [
          { type: "ground", pos: { x: 0, y: height }, amount: 5, step: { x: 300, y: 0 } },
        ],
      },
    ];
  }

  update(playerPos: Types.Math.Vector2Like) {
    const visibleChunk = Math.floor(playerPos.x / this.chunkSize);

    for (let i = visibleChunk - this._amountClosestVisibleChunks; i <= visibleChunk + this._amountClosestVisibleChunks; i++) {
      this.spawnChunk(i);
    }
  }

  spawnChunk(index: number) {
    if (this._spawnedChunks.has(index)) return;

    const chunk = this.levelTemplate.find(c => c.id === index);
    if (!chunk) {
      return;
    }

    this._currentChunkIndex = index;

    chunk.items.forEach(item => this.spawnItem({ ...item, pos: this.getLevelItemRelativePosByChunk(item) }));

    this._spawnedChunks.add(index);

    this.updateCameraBounds();
  }

  spawnItem(item: ILevelItem) {
    switch (item.type) {
      case "ground":
        for (let i = 0; i < (item.amount ?? 1); i++) {
          this.entityBuilder.createGround(this.getLevelItemConfiguredPos(item, i), item.scale);
        }
        break;

      case "oil":
        for (let i = 0; i < (item.amount ?? 1); i++) {
          this.entityBuilder.createOil(this.getLevelItemConfiguredPos(item, i));
        }
        break;

      case "robot":
        for (let i = 0; i < (item.amount ?? 1); i++) {
          this.entityBuilder.createRobot(this.getLevelItemConfiguredPos(item, i));
        }
        break;

      case "drone":
        for (let i = 0; i < (item.amount ?? 1); i++) {
          this.entityBuilder.createDrone(this.getLevelItemConfiguredPos(item, i));
        }
        break;
    }
  }

  getLevelItemConfiguredPos(item: ILevelItem, index: number): Types.Math.Vector2Like {
    return {
      x: item.pos.x + index * (item.step?.x ?? 0),
      y: item.pos.y + index * (item.step?.y ?? 0)
    };
  }

  getLevelItemRelativePosByChunk(item: ILevelItem): Types.Math.Vector2Like {
    return {
      x: item.pos.x + this.currentChunkIndex * this.chunkSize,
      y: item.pos.y
    };
  }

  updateCameraBounds(): void {
    const worldWidth: number = (this.currentChunkIndex + 1) * this.chunkSize;
    const worldHeight: number = this.scene.scale.height;

    this.scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
  }
}
