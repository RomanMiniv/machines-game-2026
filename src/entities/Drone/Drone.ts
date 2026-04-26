import { Scene, Physics, Textures, Sound } from "phaser";

export class Drone extends Physics.Arcade.Sprite {
  private readonly _velocity: number = Phaser.Math.Between(100, 200);

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "drone", frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.initAnimations();
  }

  private _moveSound: Sound.BaseSound | null;

  initAnimations(): void {
    // TODO: rename textures
    const animationName: string = "droneMove";
    if (!this.scene.anims.exists(animationName)) {
      this.scene.anims.create({
        key: animationName,
        frames: this.anims.generateFrameNames("drone", {
          prefix: "drone ",
          start: 1,
          end: 2,
          suffix: ".png",
        }),
        frameRate: 18,
        repeat: -1,
      });
    }

    this.play(animationName);

    this._moveSound = this.scene.sound.add("playerMoveSound", { loop: true, volume: .8, });
    this._moveSound?.play();
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
      if (this._moveSound) {
        this._moveSound.stop();
        this._moveSound.destroy();
        this._moveSound = null;
      }

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

    if (this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      this._moveSound?.resume();
    } else {
      this._moveSound?.pause();
    }

    this.setDrag(.01);
    this.setDamping(true);
  }
}
