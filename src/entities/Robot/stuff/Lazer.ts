import { Physics, Scene, Textures, Types } from "phaser";

export class Lazer extends Physics.Arcade.Image {
  private _targetPos: Types.Math.Vector2Like;
  private _direction: number;

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "beam", frame);

    this.setOrigin(1);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire(targetPos: Types.Math.Vector2Like) {
    this.scene.sound.play("laserSound", { volume: .5 });
    this._targetPos = targetPos;
    this._direction = Math.sign(this._targetPos.x - this.x);

    return this;
  }

  update(time: number, delta: number) {
    (this.body as Physics.Arcade.Body).setAllowGravity(false);

    this.setVelocityX(this._direction * 400);
  }
}
