import { Scene } from "phaser";

export class TestScene extends Scene {
  constructor() {
    super({
      key: "TestScene",
    });
  }

  init(data: unknown) {
  }

  preload() {
  }

  create() {
    const { width: cWidth, height: cHeight } = this.game.canvas;
    this.add.text(cWidth / 2, cHeight / 2, "Hello World!", {
      fontSize: 36
    }).setOrigin(.5);
  }

  update(time: number, delta: number): void {
  }
}
