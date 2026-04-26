import { Scene, Sound } from "phaser";
import { IMenuConfig, MenuUI } from "../components/MenuUI";

export interface IPopupData {
  title: string;
  menuConfig: IMenuConfig;
}

export class PopupScene extends Scene {
  protected menuUI: MenuUI;
  protected _wrenchSound: Sound.BaseSound | null;

  constructor() {
    super({
      key: "PopupScene",
    });
  }

  init(data: unknown) {
  }

  preload() {
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

    this.add.image(0, 0, "pauseBG").setOrigin(0);
    this.createEngeneer();

    this.createTitle();
    this.createMenu();
  }

  createEngeneer(): void {
    const engeneer = this.add.sprite(864, 632, "pauseEngineer");
    const animationName: string = "engineerWork";
    if (!this.anims.exists(animationName)) {
      this.anims.create({
        key: animationName,
        frames: this.anims.generateFrameNames("pauseEngineer", {
          prefix: "pauseEngineer",
          start: 1,
          end: 2,
          suffix: ".png",
        }),
        frameRate: 1,
        repeat: -1,
      });
    }

    this._wrenchSound = this.sound.add("wrenchSound", { loop: true });
    this._wrenchSound.play();
    engeneer.play(animationName);
  }

  createTitle(): void {
    const popupData = this.scene.settings.data as IPopupData;

    const { width, height } = this.scale;
    const title = this.add.text(width / 2, 100, popupData.title, {
      color: "#e5e5e7",
      fontSize: 48,
    }).setOrigin(.5);
    title.y += title.height * 1.5;
  }

  createMenu(): void {
    const popupData = this.scene.settings.data as IPopupData;

    this.menuUI = new MenuUI(this, popupData.menuConfig);
    this.menuUI.create();

    this.events.once("shutdown", () => {
      this.menuUI.destroy();

      if (this._wrenchSound) {
        this._wrenchSound.stop();
        this._wrenchSound = null;
      }
    });
  }



  update(time: number, delta: number): void {
  }
}
