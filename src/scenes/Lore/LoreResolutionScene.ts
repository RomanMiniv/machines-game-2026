import { LoreScene } from "./LoreScene";

export class LoreResolutionScene extends LoreScene {
  constructor() {
    super("LoreResolutionScene");
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Lore Resolution Scene", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.finish();
    });
  }
}
