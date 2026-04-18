import { LoreScene } from "./LoreScene";

export class LoreOutroScene extends LoreScene {
  constructor() {
    super("LoreOutroScene");
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Lore Outro Scene", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.finish();
    });
  }
}
