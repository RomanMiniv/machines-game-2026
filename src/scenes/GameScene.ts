import { GameObjects, Input, Physics, Scene, Sound, Types } from "phaser";
import { EUpgradeType, Player } from "../entities/Player/Player";
import { OilPickup } from "../pickups/OilPickup";
import { MagnetPickup } from "../pickups/MagnetPickup";
import { CoilPickup } from "../pickups/CoilPickup";
import { Robot } from "../entities/Robot/Robot";
import { Drone } from "../entities/Drone/Drone";
import { TransitionScene } from "./TransitionScene";
import { Beetle } from "../entities/Beetle/Beetle";
import { RobotManager } from "../entities/Robot/RobotManager";
import { IPopupData } from "./PopupScene";

export enum EGameStatus {
  START,
  LOST,
  WIN,
}

interface IInputControl {
  pause: Input.Keyboard.Key;
}

export class GameScene extends Scene {
  isGameStarted: boolean;

  player: Player;

  robotManager: RobotManager;
  droneGroup: Physics.Arcade.Group;

  groundGroup: Physics.Arcade.StaticGroup;

  oilPickupGroup: Physics.Arcade.StaticGroup;

  oilText: GameObjects.Text;
  hpText: GameObjects.Text;

  private _musicGameStart: Sound.BaseSound | null;
  private _musicGameLoop: Sound.BaseSound | null;

  private _gameStatus: EGameStatus;

  private _inputControl!: IInputControl;

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

  reset(): void {
    this.isGameStarted = false;
    this._gameStatus = EGameStatus.START;
  }

  create() {
    this.events.on("pause", () => {
      this.sound.pauseAll();
    });
    this.events.on("resume", () => {
      this.sound.resumeAll();
    });
    this.events.on("shutdown", () => {
      this.sound.stopAll();

      if (this._musicGameStart) {
        this._musicGameStart.stop();
        this._musicGameStart = null;
      }
      if (this._musicGameLoop) {
        this._musicGameLoop.stop();
        this._musicGameLoop = null;
      }
    });

    this.events.on("gameOver", (gameStatus: EGameStatus) => {
      this._gameStatus = gameStatus;
      this.setGameOver(gameStatus);
    });

    this.input.once("pointerdown", async () => {
      this.setGameOver(EGameStatus.WIN);
    });

    this.createBackground();
    this.createMap();

    this.initMusic();

    this.startGame();

    this.initUserInput();
  }

  async setGameOver(gameStatus: EGameStatus): Promise<void> {
    switch (gameStatus) {
      case EGameStatus.LOST:
        {
          const popupData: IPopupData = {
            title: "Game Over",
            menuConfig: {
              buttons: [
                {
                  label: "Retry",
                  onClick: () => {
                    this.sound.play("soundButton1", { volume: .5 });
                    this.reset();
                    this.scene.restart();
                  },
                },
                {
                  label: "Quit Game",
                  onClick: () => {
                    this.sound.play("soundButton1", { volume: .5 });
                    this.scene.stop("PopupScene");
                    this.scene.start("MenuScene");
                  },
                }
              ]
            }
          };

          this.scene.start("PopupScene", popupData);
        }
        break;
      case EGameStatus.WIN:
        {
          const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

          this.scene.bringToTop("TransitionScene");
          await transitionScene.fadeOut();

          this.scene.stop("GameScene");
          this.scene.wake("LoreManagerScene");
          this.events.emit("complete");
        }
        break;
    }
  }

  createBackground(): void {
    this.add.image(0, 0, "backgroundSky").setOrigin(0, 0);
    this.add.image(0, 0, "backgroundCity").setOrigin(0, 0);
  }

  createMap(): void {
    this.createGround();
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

  initMusic(): void {
    this._musicGameStart = this.sound.add("musicGame");

    this._musicGameLoop = this.sound.add("musicGameLoop", { loop: true });

    this._musicGameStart.play({ volume: .8 });

    this._musicGameStart.once("complete", () => {
      this._musicGameLoop?.play({ volume: .8 });

      if (this._musicGameStart) {
        this._musicGameStart.destroy();
        this._musicGameStart = null;
      }
    });
  }

  async startGame(): Promise<void> {
    this.isGameStarted = true;

    this.createPlayer();
    this.createCamera();

    this.initRobots();
    this.initDrones();
    this.initOil();

    this.setCollisions();

    this.createInfo();

    await this.playBeetle();

    this.createRobots();
    this.createDrones();

    this.createOil();
  }

  initUserInput(): void {
    this._inputControl = (this.input.keyboard as Input.Keyboard.KeyboardPlugin).addKeys({
      pause: Input.Keyboard.KeyCodes.P,
    }) as IInputControl;

    this._inputControl.pause.on("down", () => {
      this.scene.pause("GameScene");

      const popupData: IPopupData = {
        title: "Pause",
        menuConfig: {
          buttons: [
            {
              label: "Resume",
              onClick: () => {
                this.sound.play("soundButton1", { volume: .5 });
                this.scene.stop("PopupScene");
                this.scene.resume("GameScene");
              },
            },
            {
              label: "Quit Game",
              onClick: () => {
                this.sound.play("soundButton1", { volume: .5 });
                this.scene.stop("PopupScene");
                this.scene.start("MenuScene");
              },
            }
          ]
        }
      };

      this.scene.bringToTop("PopupScene");
      this.scene.launch("PopupScene", popupData);
    });
  }

  setCollisions(): void {
    // player
    this.physics.add.collider(this.player, this.groundGroup);

    // robot
    this.physics.add.collider(this.robotManager, this.groundGroup);
    this.physics.add.collider(this.player, this.robotManager);
    this.physics.add.overlap(this.player.physicsStuff, this.robotManager, (obj1, obj2) => {
      if (this.player.getCurrentUpgradeType() === EUpgradeType.ELECTROMAGNET) {
        (obj2 as Robot).kill();
      } else {
        this.playPlayerForceFiled(obj1 as Types.Physics.Arcade.ImageWithDynamicBody, obj2 as Types.Physics.Arcade.ImageWithDynamicBody);
      }
    });
    this.physics.add.overlap(this.player, this.robotManager.lazerGroup, (player, obj) => {
      (player as Player).kill(20);
      this.robotManager.lazerGroup.remove((obj as Types.Physics.Arcade.GameObjectWithBody), true, true);
    });

    // drone
    this.physics.add.collider(this.droneGroup, this.groundGroup);
    this.physics.add.collider(this.player, this.droneGroup, (player, obj) => {
      (player as Player).kill(10);
    });
    this.physics.add.collider(this.player.physicsStuff, this.droneGroup);
    this.physics.add.overlap(this.player.physicsStuff, this.droneGroup, (obj1, obj2) => {
      if (this.player.getCurrentUpgradeType() === EUpgradeType.ELECTROMAGNET) {
        (obj2 as Drone).kill();
      } else {
        this.playPlayerForceFiled(obj1 as Types.Physics.Arcade.ImageWithDynamicBody, obj2 as Types.Physics.Arcade.ImageWithDynamicBody);
      }
    });

    // pickups

    this.physics.add.overlap(this.player, this.oilPickupGroup, (player, obj) => {
      this.sound.play("oilDropSound");
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
  }

  playPlayerForceFiled(obj1: Types.Physics.Arcade.ImageWithDynamicBody, obj2: Types.Physics.Arcade.ImageWithDynamicBody,): void {
    const source = obj1;
    const target = obj2;

    const dx = target.x - source.x;
    const dy = target.y - source.y;

    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const radius = source.displayWidth;

    const nx = dx / dist;
    const ny = dy / dist;

    const pushOut = 100;

    target.setPosition(
      source.x + nx * (radius + pushOut),
      source.y + ny * (radius + pushOut)
    );

    const extraForce = 400;

    target.setVelocity(nx * extraForce, ny * extraForce);
  }

  createPlayer(): void {
    this.player = new Player(this, 100, 400).setAlpha(0);
  }

  async playBeetle(): Promise<void> {
    const beetle = new Beetle(this, -100, -100);
    this.player.setPosition(beetle.x, beetle.y).setAlpha(1);
    (this.player.body as Phaser.Physics.Arcade.Body).enable = false;
    await beetle.move({ x: 200, y: 200 }, 3000, this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).enable = true;
    await beetle.move({ x: 500, y: -100 }, 3000);
    beetle.destroy();
    this.player.isStarted = true;
  }

  createCamera(): void {
    this.physics.world.setBounds(0, 0, 3840, 1080);
    this.cameras.main.setBounds(0, 0, 3840, 1080);
    this.cameras.main.startFollow(this.player, true, .06, 0);
  }

  initRobots(): void {
    this.robotManager = new RobotManager(this.physics.world, this);
  }

  createRobots(): void {
    for (let i = 1; i <= 2; i++) {
      this.robotManager.populate({ x: i * 800, y: 500 });
    }
  }

  initDrones(): void {
    this.droneGroup = this.physics.add.group({
      runChildUpdate: true,
    });
  }
  createDrones(): void {
    for (let i = 1; i <= 2; i++) {
      this.droneGroup.add(new Drone(this, i * 800, 500));
    }
  }

  initOil(): void {
    this.oilPickupGroup = this.physics.add.staticGroup({
      classType: OilPickup,
    });
  }
  createOil(): void {
    for (let i = 1; i <= 2; i++) {
      this.oilPickupGroup.create(i * 400, 500);
    }
  }

  createInfo(): void {
    const containerInfo = this.add.container(10, 10);

    this.hpText = this.add.text(0, 0, "", {
      font: "32px Arial",
      color: "#ffffff",
      fontStyle: "bold",
    });
    containerInfo.add(this.hpText);

    this.oilText = this.add.text(0, 50, "", {
      font: "32px Arial",
      color: "#ffffff",
      fontStyle: "bold",
    });
    containerInfo.add(this.oilText);
  }

  update(time: number, delta: number): void {
    if (!this.isGameStarted || this._gameStatus) {
      return;
    }

    this.player.update(time, delta);
    this.robotManager.update(time, delta);
    this.updateInfo();
  }

  updateInfo(): void {
    this.oilText?.setText(`Oil: ${Math.ceil(this.player.oil.amount)}/${this.player.oil.max}`);
    this.hpText?.setText(`HP: ${Math.ceil(this.player.health.current)}/${this.player.health.max}`);
  }
}
