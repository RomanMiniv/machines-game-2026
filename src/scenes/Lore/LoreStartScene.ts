import { LoreScene } from "./LoreScene";

export class LoreStartScene extends LoreScene {
  constructor() {
    super("LoreStartScene");
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Lore Start Scene", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.finish();
    });
  }
}
