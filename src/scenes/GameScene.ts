import { Scene } from "phaser";

export class GameScene extends Scene {
  constructor() {
    super({
      key: "GameScene"
    });
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.scale;
    this.add.text(cWidth / 2, cHeight / 2, "Game", {
      fontSize: 36
    }).setOrigin(.5);

    this.input.once("pointerdown", () => {
      this.scene.stop("GameScene");
      this.scene.wake("LoreManagerScene");
      this.events.emit("complete");
    });
  }
}
