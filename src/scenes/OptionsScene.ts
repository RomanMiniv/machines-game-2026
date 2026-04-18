import { Scene } from "phaser";

export class OptionsScene extends Scene {
  constructor() {
    super({
      key: "OptionsScene"
    });
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Options", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}
