import { Scene, Physics, Textures, GameObjects, Types } from "phaser";
import { Lazer } from "./stuff/Lazer";

export class Robot extends Physics.Arcade.Sprite {
  private _velocity: number = 200;
  private _direction: number = -1;

  lazerGroup: Physics.Arcade.Group;

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "robot", frame);
    this.setScale(.7);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  init(lazerGroup: Physics.Arcade.Group) {
    this.lazerGroup = lazerGroup;
  }

  attack(): void {
    if (!this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      return;
    }
    this.lazerGroup.add(new Lazer(this.scene, this.x, this.y).fire({ x: 0, y: 0 }));
  }

  kill(): void {
    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.sound.play("enemyDestroyedSound");

    this.scene.cameras.main.shake(100, 0.01);

    this.setTint(0xff0000);

    const particlesEmitter = this.scene.add.particles(this.x, this.y, "explosion", {
      speed: { min: -150, max: 150 },
      angle: { min: 0, max: 360 },
      lifespan: 250,
      quantity: 25,
      scale: { start: 2, end: 0 },
      gravityY: 200,
    });

    particlesEmitter.explode();

    this.scene.time.delayedCall(200, () => {
      this.destroy();
    });
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
