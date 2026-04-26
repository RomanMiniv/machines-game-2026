import { Scene } from "phaser";
import { IMenuButton, MenuUI } from "../components/MenuUI";

export class MenuScene extends Scene {
  protected menuUI: MenuUI;

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  create() {
    const buttonSoundVolume: number = .3;

    this.menuUI = new MenuUI(this, {
      buttons: [
        {
          label: "START NEW GAME",
          onClick: () => {
            this.sound.play("soundButton1", { volume: buttonSoundVolume });
            this.scene.start("LoreManagerScene");
          }
        },
        {
          label: "OPTIONS",
          onClick: () => {
            this.sound.play("soundButton1", { volume: buttonSoundVolume });
            this.scene.start("OptionsScene");
          }
        },
        {
          label: "CREDITS",
          onClick: () => {
            this.sound.play("soundButton1", { volume: buttonSoundVolume });
            this.scene.start("CreditsScene");
          }
        }
      ]
    });
    this.menuUI.create();

    this.events.once("shutdown", () => {
      this.menuUI.destroy();
    });
  }
}
