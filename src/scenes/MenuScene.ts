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
          onClick: () => this.scene.start("Game")
        },
        {
          label: "OPTIONS",
          onClick: () => console.error("Options")
        },
        {
          label: "CREDITS",
          onClick: () => console.error("Credits")
        }
      ]
    });
    this.menuUI.create();

    this.events.once("shutdown", () => {
      this.menuUI.destroy();
    });
  }
}
