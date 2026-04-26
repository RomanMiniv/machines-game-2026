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

    const data = JSON.parse(localStorage.getItem("autoSave")!);
    const buttons: IMenuButton[] = [];
    if (data?.playerX) {
      buttons.push({
        label: "CONTINUE",
        onClick: () => {
          this.sound.play("soundButton1", { volume: buttonSoundVolume });
          this.scene.start("GameScene");
        }
      });
    }

    this.menuUI = new MenuUI(this, {
      buttons: [
        ...buttons,
        {
          label: "START NEW GAME",
          onClick: () => {
            this.sound.play("soundButton1", { volume: buttonSoundVolume });
            localStorage.removeItem("autoSave");
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
