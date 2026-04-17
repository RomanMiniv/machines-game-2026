import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super({
      key: "MainMenu"
    });
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Main Menu", {
      fontSize: 36
    }).setOrigin(.5);
  }
}
