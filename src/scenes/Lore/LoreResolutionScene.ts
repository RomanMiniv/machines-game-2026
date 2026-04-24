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
    // TODO: add visual effect
  }
}
