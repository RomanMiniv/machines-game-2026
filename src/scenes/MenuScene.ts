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
          onClick: () => this.scene.start("GameScene")
        },
        {
          label: "OPTIONS",
          onClick: () => this.scene.start("OptionsScene")
        },
        {
          label: "CREDITS",
          onClick: () => this.scene.start("CreditsScene")
        }
      ]
    });
    this.menuUI.create();

    this.events.once("shutdown", () => {
      this.menuUI.destroy();
    });
  }
}
