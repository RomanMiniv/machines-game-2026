import { Scene } from "phaser";
import { Player } from "../entities/Player";

export class GameScene extends Scene {
  player: Player;

  constructor() {
    super({
      key: "GameScene",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            x: 0,
            y: 0,
          },
        }
      },
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

    this.createPlayer();
  }

  createPlayer(): void {
    this.player = new Player(this, 100, 400, "player");
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
  }
}
