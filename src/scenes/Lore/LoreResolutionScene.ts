import { Types } from "phaser";
import { LoreScene } from "./LoreScene";

export class LoreResolutionScene extends LoreScene {
  narrativeTexts: string[] = [
    "It's a victory, hurray!!!!",
  ];

  constructor() {
    super("LoreResolutionScene");
  }

  init() {
    this._actionSysyem.init([
      async () => {
        await this.delayedCallSync(1000);
        await this.destroyMachines();
        await this.delayedCallSync(1000);
        await this.showText(this.narrativeTexts[0], { isSkipped: true });
        await this.waitClick();
        await this.hideText();
        await this.delayedCallSync(1000);
      },
      async () => {
        this.finish();
      }
    ]);
  }

  create() {
    this.add.image(0, 0, "loreIntro").setOrigin(0);

    this._actionSysyem.start();
  }

  async destroyMachines(): Promise<void> {
    await this.kill({ x: 1467, y: 810 }, 1, 2);

    await this.kill({ x: 1794, y: 207 }, .4, .8);
    await this.kill({ x: 1715, y: 220 }, .4, .8);
    await this.kill({ x: 1744, y: 161 }, .4, .8);

    await this.kill({ x: 936, y: 566 }, .8, 1.5);

    await this.kill({ x: 1086, y: 334 }, .4, .8);

    await this.kill({ x: 1386, y: 296 }, .2, .4);
    await this.kill({ x: 1400, y: 284 }, .2, .4);
  }

  async kill(pos: Types.Math.Vector2Like, scale: number, animationScale: number): Promise<void> {
    await new Promise<void>(resolve => {
      this.sound.play("enemyDestroyedSound", { volume: .8 });

      this.cameras.main.shake(100, 0.01);

      this.add.image(pos.x, pos.y, "explosion").setScale(scale);

      const particlesEmitter = this.add.particles(pos.x, pos.y, "explosion", {
        speed: { min: -150, max: 150 },
        angle: { min: 0, max: 360 },
        lifespan: 250,
        quantity: 25,
        scale: { start: animationScale, end: 0 },
        gravityY: 200,
      });

      particlesEmitter.explode();

      this.time.delayedCall(200, () => {
        resolve();
      });
    });

  }
}
