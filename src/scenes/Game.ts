import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super({
      key: "Game"
    });
  }

  create() {
    console.error("Game");
  }
}
