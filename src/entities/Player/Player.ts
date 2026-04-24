import { Scene, Physics, Input, Textures, Sound } from "phaser";
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

  private readonly _jumpVelocity: number = -750;
  private _wasGrounded: boolean = false;
  private _prevVelocityY: number = 0;

  oil: Oil;

  private _moveSound: Sound.BaseSound | null;

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "playerGear", frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.initUpgrade();
    this.initStuff();

    this._inputControl = (this.scene.input.keyboard as Input.Keyboard.KeyboardPlugin).addKeys({
      right: Input.Keyboard.KeyCodes.D,
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
        scene.cameras.main.shake(timeStep * 3, .004);

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

    if (this._inputControl.left.isDown) {
      velocityHorizontalDirection -= 1;
    }
    if (this._inputControl.right.isDown) {
      velocityHorizontalDirection += 1;
    }
    if (velocityHorizontalDirection !== 0) {
      if (!this._moveSound || !this._moveSound.isPlaying) {
        this._moveSound = this.scene.sound.add("playerMoveSound", { loop: true });
        this._moveSound.play();
      }
    } else {
      if (this._moveSound) {
        this._moveSound.stop();
        this._moveSound.destroy();
        this._moveSound = null;
      }
    }

    const vx = velocityHorizontalDirection * this._velocity;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const isGrounded = body.blocked.down;
    const isFalling = body.velocity.y > 0;
    const isApex = !isGrounded && Math.abs(body.velocity.y) < 80;

    if (this._inputControl.space.isDown && isGrounded) {
      this.scene.sound.play("playerJumpSound");
      this.setVelocityY(this._jumpVelocity);
    }

    // hang effect
    let airControl = isGrounded ? 1 : .6;
    if (isApex) {
      airControl = 1.25;
      this.setVelocityY(body.velocity.y * .85);
    }

    // move
    this.setAccelerationX(vx * airControl);

    const oilFactor: number = this.oil.amount / 100;

    this.setMaxVelocity(this._velocity * (.5 + .5 * oilFactor));

    this.setDragX(this._dragFactor * (.5 + .5 * oilFactor) * airControl);
    this.setDamping(true);

    // falling
    if (isFalling) {
      const MAX_FALL_SPEED = 1400;
      this.setVelocityY(
        Math.min(body.velocity.y * 1.2, MAX_FALL_SPEED)
      );
    }

    // bounce
    const justLanded = isGrounded && !this._wasGrounded;
    if (justLanded) {
      const fallSpeed = this._prevVelocityY;

      if (fallSpeed > 200) {
        const bounce = Math.min(fallSpeed * .2, 200);
        this.setVelocityY(-bounce);
      }
    }

    // rotation
    const bodyVelocity = this.body?.velocity;
    if (bodyVelocity?.length() && bodyVelocity?.length() > .1) {
      const direction = Math.sign(bodyVelocity.x) || -Math.sign(bodyVelocity.y);
      this.rotation += bodyVelocity.length() * direction * this._rotationFactor;
    }

    this._prevVelocityY = body.velocity.y;
    this._wasGrounded = isGrounded;
  }
}
