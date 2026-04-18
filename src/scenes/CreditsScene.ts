import { Scene } from "phaser";

export class CreditsScene extends Scene {
  constructor() {
    super({
      key: "CreditsScene"
    });
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Credits", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}
