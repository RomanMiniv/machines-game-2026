import { LoreScene } from "./LoreScene";

export class LoreIntroScene extends LoreScene {
  narrativeTexts: string[] = [
    "Want to know how we got to this point?",
    "Well, I doubt you'll take my word for it.",
    "Well, let me just show you how it all started.",
  ];

  constructor() {
    super("LoreIntroScene");
  }

  init() {
    this._actionSysyem.init([
      async () => {
        await this.delayedCallSync(1000);
        await this.showText(this.narrativeTexts[0], { isSkipped: true });
        await this.waitClick();
        await this.showText(this.narrativeTexts[1], { isSkipped: true });
        await this.waitClick();
        await this.showText(this.narrativeTexts[2], { isSkipped: true });
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
}

