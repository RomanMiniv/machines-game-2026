import { Scene, Physics, Input, Textures } from "phaser";
import { Oil } from "./stuff/Oil";

interface IInputControl {
  up: Input.Keyboard.Key;
  right: Input.Keyboard.Key;
  down: Input.Keyboard.Key;
  left: Input.Keyboard.Key;
  space: Input.Keyboard.Key;
}

export class Player extends Physics.Arcade.Image {
  private _inputControl!: IInputControl;

  private readonly _velocity: number = 1300;
  private readonly _rotationFactor: number = .00004;
  private readonly _dragFactor: number = .01;

  oil: Oil;

  constructor(scene: Scene, x: number, y: number, texture: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this._inputControl = (this.scene.input.keyboard as Input.Keyboard.KeyboardPlugin).addKeys({
      up: Input.Keyboard.KeyCodes.W,
      right: Input.Keyboard.KeyCodes.D,
      down: Input.Keyboard.KeyCodes.S,
      left: Input.Keyboard.KeyCodes.A,
      space: Input.Keyboard.KeyCodes.SPACE,
    }) as IInputControl;

    this.initStuff();
  }

  initStuff(): void {
    this.oil = new Oil();
  }

  update(time: number, delta: number) {
    this.move();
    this.oil.update(time, delta);
  }

  move(): void {
    let velocityHorizontalDirection: number = 0;
    let velocityVerticalDirection: number = 0;

    if (this._inputControl.left.isDown) {
      velocityHorizontalDirection -= 1;
    }
    if (this._inputControl.right.isDown) {
      velocityHorizontalDirection += 1;
    }

    if (this._inputControl.up.isDown) {
      velocityVerticalDirection -= 1;
    }
    if (this._inputControl.down.isDown) {
      velocityVerticalDirection += 1;
    }

    const vx = velocityHorizontalDirection * this._velocity;
    const vy = velocityVerticalDirection * this._velocity;

    // Diagonal movement normalization
    const vec = new Phaser.Math.Vector2(vx, vy);

    if (vec.length() > 0) {
      vec.normalize().scale(this._velocity);
    }

    this.setAcceleration(vec.x, vec.y);

    const oilFactor: number = this.oil.amount / 100;

    this.setMaxVelocity(this._velocity * (.5 + .5 * oilFactor));

    this.setDrag(this._dragFactor * (.5 + .5 * oilFactor));
    this.setDamping(true);

    const bodyVelocity = this.body?.velocity;
    if (bodyVelocity?.length() && bodyVelocity?.length() > .1) {
      const direction = Math.sign(bodyVelocity.x) || -Math.sign(bodyVelocity.y);
      this.rotation += bodyVelocity.length() * direction * this._rotationFactor;
    }
  }
}
