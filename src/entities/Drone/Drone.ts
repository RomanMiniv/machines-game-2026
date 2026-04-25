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

    this.scene.time.delayedCall(300, () => {
      this.destroy();
    });
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
