import { Scene, Physics, Textures } from "phaser";

export class Drone extends Physics.Arcade.Sprite {
  private readonly _velocity: number = Phaser.Math.Between(50, 200);

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "drone", frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.initAnimations();
  }

  initAnimations(): void {
    // TODO: rename textures
    this.scene.anims.create({
      key: "droneMove",
      frames: this.anims.generateFrameNames("drone", {
        prefix: "drone ",
        start: 1,
        end: 2,
        suffix: ".png",
      }),
      frameRate: 18,
      repeat: -1,
    });

    this.play("droneMove");
  }

  update(time: number, delta: number) {
    this.move(time);
  }

  move(time: number): void {
    const body = this.body as Physics.Arcade.Body;

    body.setAllowGravity(false);
    this.setCollideWorldBounds(true);

    this.setAccelerationX(-this._velocity);
    this.setMaxVelocity(this._velocity);

    this.setDrag(.01);
    this.setDamping(true);
  }
}
