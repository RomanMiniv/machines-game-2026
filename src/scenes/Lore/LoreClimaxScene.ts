import { Cameras, GameObjects, Types } from "phaser";
import { LoreScene } from "./LoreScene";

export class LoreClimaxScene extends LoreScene {
  gear: GameObjects.Image;
  gearData = {
    pos: {
      x: 1450,
      y: 222,
    },
  };

  superMachine: GameObjects.Image;
  switcher: GameObjects.Image;
  switcherText: GameObjects.Text;

  narrativeTexts: string[] = [
    "Is humanity doomed?",
    "I can't believe it, the super machine is working again, quickly, turn it on!",
    "And that's all?"
  ];

  constructor() {
    super("LoreClimaxScene");
  }

  init() {
    this._actionSysyem.init([
      async () => {
        await this.showText(this.narrativeTexts[0]);
        await this.delayedCallSync(1000);
      },
      async () => {
        await this.playGear();
        await this.showText(this.narrativeTexts[1], { isSkipped: true });
        await this.waitClick();
      },
      async () => {
        await this.playSuperMachine();
      },
      async () => {
        await this.showText(this.narrativeTexts[2], { isSkipped: true });
        await this.waitClick();
        await this.delayedCallSync(1000);
      },
      async () => {
        this.finish();
      }
    ]);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(0, 0, "loreHope").setOrigin(0).setDepth(-2);
    this.superMachine = this.add.image(0, 0, "superMachine").setOrigin(0).setDepth(-1);

    this.add.image(width / 2, 620, "engineer");

    this.switcher = this.add.image(2680, 444, "switchOn");
    this.switcherText = this.add.text(2680, 274, "ON", {
      fontSize: "48px",
      color: "#3d3b40",
      fontStyle: "bold",

    }).setOrigin(0.5);

    this._actionSysyem.start();
  }

  async playGear(): Promise<void> {
    this.createGear();
    const moveSound = this.sound.add("playerMoveSound", { loop: true });
    moveSound.play();
    await this.moveGear({ x: 200, y: this.gear.y }, 3000);
    moveSound.pause();

    this.resetGearUpgrade("plaerMagnetGear");
    await this.delayedCallSync(1000);

    moveSound.resume();
    await this.moveGear({ x: 600, y: this.gear.y }, 3000);
    moveSound.pause();
    this.resetGearUpgrade("playerGear");
    await this.delayedCallSync(1000);

    moveSound.play();
    await this.moveGear({ x: this.gearData.pos.x - 100, y: this.gear.y }, 3000);
    await this.moveGear({ x: this.gearData.pos.x, y: this.gearData.pos.y }, 3000);
    moveSound.stop();
  }
  createGear(): void {
    this.gear = this.add.image(-150, 800, "playerCoilMagnetGear");
  }
  async moveGear(toPos: Types.Math.Vector2Like, duration: number): Promise<void> {
    const fromX = this.gear.x;
    const fromY = this.gear.y;

    await new Promise<void>((resolve) => {
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration,
        ease: "Linear",
        onUpdate: (tween) => {
          const t = tween.getValue() ?? 1;

          const x = fromX + (toPos.x - fromX) * t;
          const y = fromY + (toPos.y - fromY) * t;

          this.gear.setPosition(x, y);

          this.gear.setRotation(this.gear.rotation + .02);
        },
        onComplete: () => resolve()
      });
    });
  }
  async resetGearUpgrade(textureKey: string): Promise<void> {
    await new Promise<void>(resolve => {
      const { x, y } = this.gear;
      const timeStep = 50;

      this.time.delayedCall(60, () => {
        const shake = { t: 0 };

        const soundKey: string = textureKey === "plaerMagnetGear" ? "electromagnetSound" : "magnetSound";
        this.sound.play(soundKey);

        this.tweens.add({
          targets: shake,
          t: 1,
          duration: timeStep,
          yoyo: true,
          repeat: 4,
          onUpdate: () => {
            const strength = (1 - shake.t) * 10;

            this.gear.setPosition(
              x + Phaser.Math.FloatBetween(-strength, strength),
              y + Phaser.Math.FloatBetween(-strength, strength)
            );
          },
          onComplete: () => {
            this.gear.setPosition(x, y);
            resolve();
          },
          ease: "Sine.easeInOut"
        });

        this.time.delayedCall(timeStep * 2, () => {
          this.gear.setTexture(textureKey);
        });
      });
    });
  }

  async playSuperMachine(): Promise<void> {
    this.sound.play("machineSound");
    await this.startSuperMachine(500);
    await this.delayedCallSync(1000);

    const camera = this.cameras.main;
    await this.moveCamera(3000, { x: this.superMachine.width - this.scale.width + this.scale.width / 2, y: camera.midPoint.y });
    await this.delayedCallSync(1000);
    this.sound.play("switchSound");
    this.switcher.setTexture("switchOff");
    this.switcherText.setText("OFF");
    await this.delayedCallSync(1000);
  }
  async startSuperMachine(duration: number): Promise<void> {
    const target = this.add.container(0, 0, [
      this.superMachine,
      this.gear
    ]).setDepth(this.superMachine.depth);

    await new Promise<void>(resolve => {
      const { x, y } = target;

      const shake = { t: 0 };

      this.tweens.add({
        targets: shake,
        t: 1,
        duration,
        yoyo: true,
        repeat: 2,
        onUpdate: () => {
          const strength = (1 - shake.t) * 10;

          target.setPosition(
            x + Phaser.Math.FloatBetween(-strength, strength),
            y + Phaser.Math.FloatBetween(-strength, strength)
          );
        },
        onComplete: () => {
          target.setPosition(x, y);
          resolve();
        },
        ease: "Sine.easeInOut"
      });
    });
  }

  async moveCamera(duration: number, pos: Types.Math.Vector2Like): Promise<void> {
    const camera = this.cameras.main;
    await new Promise<void>(resolve => {
      camera.once(Cameras.Scene2D.Events.PAN_COMPLETE, () => {
        resolve();
      });
      camera.pan(pos.x, pos.y, duration, "Sine.easeInOut");
    });
  }
}
