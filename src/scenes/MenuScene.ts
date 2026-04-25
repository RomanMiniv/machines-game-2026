import { Scene } from "phaser";
import { MenuUI } from "../components/MenuUI";

export class MenuScene extends Scene {
  protected menuUI: MenuUI;

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  create() {
    this.menuUI = new MenuUI(this, {
      buttons: [
        {
          label: "PLAY",
          onClick: () => {
            this.sound.play("soundButton1", { volume: .3 });
            this.scene.start("LoreManagerScene");
            // this.scene.start("GameScene");
          }
        },
        {
          label: "OPTIONS",
          onClick: () => {
            this.sound.play("soundButton1", { volume: .3 });
            this.scene.start("OptionsScene");
          }
        },
        {
          label: "CREDITS",
          onClick: () => {
            this.sound.play("soundButton1", { volume: .3 });
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
