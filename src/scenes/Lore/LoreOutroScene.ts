import { Cameras, GameObjects, Types } from "phaser";
import { LoreScene } from "./LoreScene";

export class LoreOutroScene extends LoreScene {
  gear: GameObjects.Image;
  gearData = {
    pos: {
      x: 1450,
      y: 222,
    },
  };

  narrativeTexts: string[] = [
    "Hooray, it worked!!!!",
    "Wait, I didn't disappear, I'm alive?",
  ];

  constructor() {
    super("LoreOutroScene");
  }

  init() {
    this._actionSysyem.init([
      async () => {
        await this.delayedCallSync(1000);
        const camera = this.cameras.main;
        await this.moveCamera(3000, { x: camera.width / 2, y: camera.height / 2 });

        await this.showText(this.narrativeTexts[0], { isSkipped: true });
        await this.waitClick();
        await this.hideText();
      },
      async () => {
        await this.highilightGear(2000);
        await this.showText(this.narrativeTexts[1], { isSkipped: true });
        await this.waitClick();
        await this.zoomToObject(this.gear, 2000);
        await this.delayedCallSync(1000);
      },
      async () => {
        this.finish();
      }
    ]);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(0, 0, "loreHope").setOrigin(0);
    const superMachine = this.add.image(0, 0, "superMachine").setOrigin(0);

    this.add.image(2680, 444, "switchOn");
    this.add.text(2680, 274, "OFF", {
      fontSize: "48px",
      color: "#3d3b40",
      fontStyle: "bold",

    }).setOrigin(0.5);

    this.add.image(width / 2, 620, "engineer");

    this.gear = this.add.image(this.gearData.pos.x, this.gearData.pos.y, "playerGear");

    const camera = this.cameras.main;
    camera.setBounds(0, 0, 3840, 1080);
    camera.setScroll(superMachine.width - this.scale.width, 0);

    this._actionSysyem.start();
  }

  async moveCamera(duration: number, pos: Types.Math.Vector2Like): Promise<void> {
    const camera = this.cameras.main;
    await new Promise<void>(resolve => {
      camera.once(Cameras.Scene2D.Events.PAN_COMPLETE, () => {
        resolve();
      });
      camera.pan(pos.x, pos.y, duration, "Sine.easeInOut");
    });
  }

  async highilightGear(duration: number): Promise<void> {
    await new Promise<void>((resolve) => {
      this.tweens.add({
        targets: this.gear,
        alpha: 0,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => resolve()
      });
    });

    this.gear.setTexture("playerGearCopper");

    await new Promise<void>((resolve) => {
      this.tweens.add({
        targets: this.gear,
        alpha: 1,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => resolve()
      });
    });
  }

  async zoomToObject(objectUI: GameObjects.Image, duration: number): Promise<void> {
    const camera = this.cameras.main;

    const zoomLevel: number = 2;

    await new Promise<void>((resolve) => {
      this.tweens.add({
        targets: camera,
        scrollX: objectUI.x - camera.width / zoomLevel,
        scrollY: objectUI.y - camera.height / zoomLevel,
        zoom: zoomLevel,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => resolve()
      });
    });
  }
}
