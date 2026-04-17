import { Scene } from "phaser";
import gearURL from "@assets/images/gear.svg";

export class Boot extends Scene {
  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("loaderGear", gearURL);
  }

  create() {
    this.scene.start("Preload");
  }
}
