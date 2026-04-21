import { Scene, Physics, Input, Textures } from "phaser";
import { Oil } from "./stuff/Oil";

interface IInputControl {
  up: Input.Keyboard.Key;
  right: Input.Keyboard.Key;
  down: Input.Keyboard.Key;
  left: Input.Keyboard.Key;
  space: Input.Keyboard.Key;
}

export enum EUpgradeType {
  DEFAULT,
  MAGNET,
  ELECTROMAGNET,
}

interface IUpgradeState {
  current: EUpgradeType;
  textures: string[];
}

export class Player extends Physics.Arcade.Image {
  private _inputControl!: IInputControl;

  private _upgradeState: IUpgradeState;

  private readonly _velocity: number = 1300;
  private readonly _rotationFactor: number = .00004;
  private readonly _dragFactor: number = .01;

  oil: Oil;

  constructor(scene: Scene, x: number, y: number, texture: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.initUpgrade();
    this.initStuff();

    this._inputControl = (this.scene.input.keyboard as Input.Keyboard.KeyboardPlugin).addKeys({
      up: Input.Keyboard.KeyCodes.W,
      right: Input.Keyboard.KeyCodes.D,
      down: Input.Keyboard.KeyCodes.S,
      left: Input.Keyboard.KeyCodes.A,
      space: Input.Keyboard.KeyCodes.SPACE,
    }) as IInputControl;
  }

  initUpgrade(): void {
    this._upgradeState = {
      current: EUpgradeType.DEFAULT,
      textures: ["playerGear", "plaerMagnetGear", "playerCoilMagnetGear"]
    };
  }

  initStuff(): void {
    this.oil = new Oil();
  }

  async upgrade(upgradeType: EUpgradeType): Promise<void> {
    // TODO: add animation to overlapped object? fly object to player for example
    await new Promise<void>(resolve => {
      const newTexture: string = this._upgradeState.textures[upgradeType];

      const scene = this.scene;
      const { x, y } = this;
      const timeStep = 50;

      scene.time.delayedCall(60, () => {
        scene.cameras.main.shake(timeStep * 3, 0.004);

        const shake = { t: 0 };

        scene.tweens.add({
          targets: shake,
          t: 1,
          duration: timeStep,
          yoyo: true,
          repeat: 4,
          onUpdate: () => {
            const strength = (1 - shake.t) * 10;

            this.setPosition(
              x + Phaser.Math.FloatBetween(-strength, strength),
              y + Phaser.Math.FloatBetween(-strength, strength)
            );
          },
          onComplete: () => {
            this.setPosition(x, y);
            resolve();
          },
          ease: "Sine.easeInOut"
        });

        scene.time.delayedCall(timeStep * 2, () => {
          this.setTexture(newTexture);
        });
      });
    });

    this._upgradeState.current = upgradeType;
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
