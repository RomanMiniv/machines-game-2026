import { Scene } from "phaser";

export class GameScene extends Scene {
  constructor() {
    super({
      key: "Game"
    });
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Game", {
      fontSize: 36
    }).setOrigin(.5);
  }
}
