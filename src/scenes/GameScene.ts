import { GameObjects, Physics, Scene } from "phaser";
import { Player } from "../entities/Player/Player";
import { OilPickup } from "../entities/Player/stuff/Oil";

export class GameScene extends Scene {
  player: Player;
  oilGroup: Physics.Arcade.StaticGroup;

  oilText: GameObjects.Text;

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
          debug: true,
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
    this.createOil();

    this.createInfo();

    this.physics.add.overlap(this.player, this.oilGroup, (player, oil) => {
      this.player.oil.collect((oil as OilPickup).amount);
      oil.destroy();
    });
  }

  createOil(): void {
    this.oilGroup = this.physics.add.staticGroup({
      classType: OilPickup,
    });

    for (let i = 1; i <= 2; i++) {
      this.oilGroup.create(i * 400, 200, "oil").setTintMode(Phaser.TintModes.FILL);
    }
  }

  createInfo(): void {
    this.oilText = this.add.text(10, 10, 'Oil: 100', {
      font: '20px Arial',
      color: '#ffffff'
    });
  }

  createPlayer(): void {
    this.player = new Player(this, 100, 400, "player");
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
    this.updateInfo();
  }

  updateInfo(): void {
    this.oilText.setText(`Oil: ${Math.ceil(this.player.oil.amount)}/${this.player.oil.max}`);
  }
}
