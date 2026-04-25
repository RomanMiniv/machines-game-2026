import { Scene, Physics, Textures } from "phaser";
import { Lazer } from "./stuff/Lazer";

export class Robot extends Physics.Arcade.Sprite {
  private _velocity: number = 200;
  private _direction: number = -1;

  lazerGroup: Physics.Arcade.Group;

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "robot", frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // TODO: connect with game flow
    setTimeout(() => {
      this.attack();
    }, 1000);
  }

  init(lazerGroup: Physics.Arcade.Group) {
    this.lazerGroup = lazerGroup;
  }

  attack(): void {
    this.lazerGroup.add(new Lazer(this.scene, this.x, this.y).fire({ x: 0, y: 0 }));
  }

  update(time: number, delta: number) {
    this.move();
  }

  move(): void {
    this.setCollideWorldBounds(true);

    this.setAccelerationX(this._velocity * this._direction);
    this.setMaxVelocity(this._velocity);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.right) {
      this._direction = -1;
      this.setFlipX(false);
    } else if (body.blocked.left) {
      this.attack();
      this._direction = 1;
      this.setFlipX(true);
    }

    this.setDrag(.01);
    this.setDamping(true);
  }
}
