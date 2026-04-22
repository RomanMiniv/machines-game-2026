import { GameObjects, Physics, Scene, Types } from "phaser";
import { EUpgradeType, Player } from "../entities/Player/Player";
import { OilPickup } from "../pickup/OilPickup";
import { MagnetPickup } from "../pickup/MagnetPickup";
import { CoilPickup } from "../pickup/CoilPickup";

export class GameScene extends Scene {
  player: Player;

  groundGroup: Physics.Arcade.StaticGroup;

  oilPickupGroup: Physics.Arcade.StaticGroup;

  oilText: GameObjects.Text;

  constructor() {
    super({
      key: "GameScene",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            x: 0,
            y: 1200,
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

    this.createGround();
    this.physics.add.collider(this.player, this.groundGroup);

    this.physics.add.overlap(this.player, this.oilPickupGroup, (player, obj) => {
      this.player.oil.collect((obj as OilPickup).amount);
      obj.destroy();
    });

    const magnetPickup = new MagnetPickup(this, 500, 500);
    this.physics.add.overlap(this.player, magnetPickup, async (player, obj) => {
      (obj as MagnetPickup).disableBody();
      await this.player.upgrade(EUpgradeType.MAGNET);
      obj.destroy();
    });

    const coilPickup = new CoilPickup(this, 1000, 500);
    this.physics.add.overlap(this.player, coilPickup, async (player, obj) => {
      (obj as CoilPickup).disableBody();
      await this.player.upgrade(EUpgradeType.ELECTROMAGNET);
      obj.destroy();
    });

    this.createInfo();
  }

  createPlayer(): void {
    this.player = new Player(this, 100, 400, "playerGear"); //TODO: move texture to class Player
  }

  createOil(): void {
    this.oilPickupGroup = this.physics.add.staticGroup({
      classType: OilPickup,
    });

    for (let i = 1; i <= 2; i++) {
      this.oilPickupGroup.create(i * 400, 200);
    }
  }

  createGround(): void {
    this.groundGroup = this.physics.add.staticGroup();

    this.spawnGround({ x: 0, y: this.scale.height }, { x: 5, y: 1 });

    this.spawnGround({ x: 300 * 6, y: this.scale.height });
  }
  spawnGround(pos: Types.Math.Vector2Like, scale?: Types.Math.Vector2Like): void {
    (this.groundGroup.create(pos.x, pos.y, "ground") as Physics.Arcade.Image)
      .setOrigin(0, 1)
      .setScale(scale?.x ?? 1, scale?.y ?? 1)
      .refreshBody();
  }

  createInfo(): void {
    this.oilText = this.add.text(10, 10, "Oil: 100", {
      font: "20px Arial",
      color: "#ffffff"
    });
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
    this.updateInfo();
  }

  updateInfo(): void {
    this.oilText.setText(`Oil: ${Math.ceil(this.player.oil.amount)}/${this.player.oil.max}`);
  }
}
