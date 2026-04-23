import { LoreScene } from "./LoreScene";

export class LoreIntroScene extends LoreScene {
  constructor() {
    super("LoreIntroScene");
  }

  create() {
    this.add.image(0, 0, "loreIntro").setOrigin(0);

    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Lore Intro Scene", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.finish();
    });
  }
}
