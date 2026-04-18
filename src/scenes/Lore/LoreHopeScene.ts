import { LoreScene } from "./LoreScene";

export class LoreHopeScene extends LoreScene {
  constructor() {
    super("LoreHopeScene");
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Lore Hope Scene", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.finish();
    });
  }
}
