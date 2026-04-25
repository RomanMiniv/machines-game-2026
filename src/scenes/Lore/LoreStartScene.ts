import { Cameras, GameObjects, Types } from "phaser";
import { LoreScene } from "./LoreScene";
import { Beetle } from "../../entities/Beetle/Beetle";

export class LoreStartScene extends LoreScene {
  programmer: GameObjects.Image;
  beetle: Beetle;
  robot: GameObjects.Sprite;

  narrativeTexts: string[] = [
    "Need some coffee.",
    "Oh shit."
  ];

  computerData = {
    startPos: {
      x: 810,
      y: 320,
    },
  };

  constructor() {
    super("LoreStartScene");
  }

  init() {
    this._actionSysyem.init([
      async () => {
        await this.delayedCallSync(1000);
        await this.playComputerScript(4000, 0x00ff00, 270);
        await this.playComputerScript(4000, 0x00ff00, 270, { x: 0, y: 20 });
      },
      async () => {
        await this.showText(this.narrativeTexts[0]);
        await this.delayedCallSync(1000);
        await this.moveProgrammer(8000, this.programmer.x + 800);
        await this.hideText();
      },
      async () => {
        await this.playComputerScript(1000, 0x00ff00, 70, { x: 0, y: 40 });
        await this.playBeetle();
        await this.playComputerScript(3000, 0xff0000, 200, { x: 70, y: 40 });
        await this.delayedCallSync(1000);
      },
      async () => {
        await this.moveProgrammer(8000, this.programmer.x - 800);
        await this.showText(this.narrativeTexts[1]);
        await this.delayedCallSync(2000);
      },
      async () => {
        await this.transformRobot();
        await this.delayedCallSync(1000);
        await this.robotAttck();
        await this.highlightRobotAttack();
      },
      async () => {
        this.finish();
      }
    ]);
  }

  create() {
    this.add.image(0, 0, "loreStart").setOrigin(0).setDepth(-1);
    this.add.image(948, 442, "computer");

    this.programmer = this.add.image(938, 684, "programmer");

    this.createRobot();

    this._actionSysyem.start();
  }

  async playComputerScript(duration: number, color: number, width: number, offset: Types.Math.Vector2Like = { x: 0, y: 0 }): Promise<void> {
    await new Promise<void>(resolve => {
      const { startPos } = this.computerData;
      const line = this.add.rectangle(startPos.x + offset.x, startPos.y + offset.y, width, 4, color)
        .setOrigin(0, 0.5)
        .setScale(0, 1);

      this.tweens.add({
        targets: line,
        scaleX: 1,
        duration,
        ease: "Sine.easeOut",
        onComplete: () => resolve()
      });
    });
  }

  async moveProgrammer(duration: number, x: number): Promise<void> {
    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: this.programmer,
        x,
        duration,
        ease: "Cubic.easeOut",
        onComplete: () => resolve(),
      });
    });
  }

  async playBeetle(): Promise<void> {
    this.beetle = new Beetle(this, 1256, -198).setDepth(-1);

    await this.beetle.move({ x: 1500, y: 100 }, 5000);
    await this.beetle.move({ x: 800, y: 150 }, 5000);
    await this.beetle.move({ x: 950, y: 400 }, 5000);

    this.beetle.destroy();
  }

  createRobot(): void {
    this.robot = this.add.sprite(432, 604, "robot", "robot_default.png").setScale(1.1);
  }
  async transformRobot(): Promise<void> {
    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: this.robot,
        x: this.robot.x + 6,
        yoyo: true,
        repeat: 5,
        duration: 50,
        ease: "Sine.easeInOut",
        onComplete: () => resolve()
      });
    });

    this.robot.setFrame("robot_attack.png").setPosition(344, 604);

    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: this.robot,
        x: this.robot.x + 10,
        yoyo: true,
        repeat: 2,
        duration: 40,
        ease: "Sine.easeOut",
        onComplete: () => resolve()
      });
    });
  }
  async robotAttck(): Promise<void> {
    this.sound.play("laserSound");
    this.add.image(100, 526, "beam").setOrigin(1);
  }
  async highlightRobotAttack(): Promise<void> {
    await new Promise<void>(resolve => {
      this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        resolve();
      });
      this.cameras.main.fadeOut(1000, 255);
    });
  }
}
