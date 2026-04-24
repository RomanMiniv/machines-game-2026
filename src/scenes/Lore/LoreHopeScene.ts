import { GameObjects } from "phaser";
import { Beetle } from "../../entities/Beetle/Beetle";
import { LoreScene } from "./LoreScene";

export class LoreHopeScene extends LoreScene {
  beetle: Beetle;
  gear: GameObjects.Image;

  gearData = {
    pos: {
      x: 1450,
      y: 222,
    },
  };

  narrativeTexts: string[] = [
    "The best engineer was hired to build a machine that could stop other machines.",
    "So he started building a super machine.",
    "And when it was almost finished, you won't believe it, he flew in again!",
    "And stole one of the machine's parts, without which the super machine is no longer super.",
    "Is humanity doomed?",
  ];

  constructor() {
    super("LoreHopeScene");
  }

  init() {
    this._actionSysyem.init([
      async () => {
        await this.delayedCallSync(1000);
        await this.playEngineer(2000);
        await this.showText(this.narrativeTexts[0], { isSkipped: true });
        await this.waitClick();
      },
      async () => {
        await this.hideText();
        await this.playSuperMachine(2000);
        await this.showText(this.narrativeTexts[1], { isSkipped: true });
        await this.waitClick();
      },
      async () => {
        await this.showText(this.narrativeTexts[2]);

        this.createBeetle();
        await this.beetle.move({ x: 600, y: 100 }, 5000);
        await this.delayedCallSync(1000);
        await this.beetle.move({ x: this.gearData.pos.x, y: this.gearData.pos.y }, 5000);
        await this.delayedCallSync(1000);
      },
      async () => {
        await this.beetle.move({ x: 1700, y: -198 }, 5000, this.gear);
        this.gear.destroy();
        this.gear.destroy();

        await this.showText(this.narrativeTexts[3], { isSkipped: true });
        await this.waitClick();
      },
      async () => {
        await this.showText(this.narrativeTexts[4], { isSkipped: true });
        await this.waitClick();
        await this.delayedCallSync(1000);
      },
      async () => {
        this.finish();
      }
    ]);
  }

  create() {
    this.add.image(0, 0, "loreHope").setOrigin(0).setDepth(-1);

    this._actionSysyem.start();
  }

  async playEngineer(duration: number): Promise<void> {
    const { width, height } = this.scale;
    const engineer = this.add.image(width / 2, 620, "engineer")
      .setAlpha(0)
      .setScale(.95);

    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: engineer,
        alpha: 1,
        scale: 1,
        duration,
        ease: "Sine.easeOut",
        onComplete: () => resolve()
      });
    });
  }

  async playSuperMachine(duration: number): Promise<void> {
    this.gear = this.add.image(this.gearData.pos.x, this.gearData.pos.y, "playerGear");
    const container = this.add.container(0, 0, [
      this.add.image(0, 0, "superMachine").setOrigin(0),
      this.gear,
    ]).setAlpha(0).setDepth(-1);

    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: container,
        alpha: 1,
        duration,
        ease: "Sine.easeOut",
        onComplete: () => resolve()
      });
    });
  }

  createBeetle(): void {
    this.beetle = new Beetle(this, 1256, -198).setDepth(-1);
  }
}
