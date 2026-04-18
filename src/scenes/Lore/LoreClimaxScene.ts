import { LoreScene } from "./LoreScene";

export class LoreClimaxScene extends LoreScene {
  constructor() {
    super("LoreClimaxScene");
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Lore Climax Scene", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.finish();
    });
  }
}
