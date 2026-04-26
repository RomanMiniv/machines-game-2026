import { Scene, Physics, Textures, GameObjects, Types } from "phaser";
import { Lazer } from "./stuff/Lazer";

export class Robot extends Physics.Arcade.Sprite {
  private _velocity: number = 200;
  private _direction: number = -1;

  lazerGroup: Physics.Arcade.Group;

  private _attackTimer: Phaser.Time.TimerEvent;

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "robot", frame);
    this.setScale(.7);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  init(lazerGroup: Physics.Arcade.Group) {
    this.lazerGroup = lazerGroup;

    this._attackTimer = this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        if (Phaser.Math.Between(0, 1)) {
          this.attack();
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  attack(): void {
    if (!this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      return;
    }
    this.lazerGroup.add(new Lazer(this.scene, this.x, this.y).fire({ x: 0, y: 0 }));
  }

  kill(): void {
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this._attackTimer.destroy();
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

    if (!this.isMovable()) {
      this.setMaxVelocity(0);
    }

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

    if (this.y + this.displayHeight / 2 >= this.scene.scale.height - 10) {
      this.kill();
    }
  }

  isMovable(): boolean {
    const offsetX = this.displayWidth * 2;
    const offsetY = this.displayHeight * 2;

    const cameraView = this.scene.cameras.main.worldView;

    const isInCameraView =
      this.x >= cameraView.x - offsetX &&
      this.x <= cameraView.x + cameraView.width + offsetX &&
      this.y >= cameraView.y - offsetY &&
      this.y <= cameraView.y + cameraView.height + offsetY;

    return isInCameraView;
  }
}
