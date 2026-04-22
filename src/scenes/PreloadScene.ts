import { Scene } from "phaser";

import { LoaderUI } from "../components/LoaderUI";

import gearURL from "@assets/images/player/gear.png";
import magnetGearURL from "@assets/images/player/magnetGear.png";
import coilMagnetGearURL from "@assets/images/player/coilMagnetGear.png";

import oilURL from "@assets/images/stuff/oil.png";
import magnetURL from "@assets/images/stuff/magnet.png";
import coilURL from "@assets/images/stuff/coil.png";

import groundURL from "@assets/images/ground.jpg";

export class PreloadScene extends Scene {
  constructor() {
    super({
      key: "PreloadScene"
    });
  }

  preload() {
    //  Load the assets for the game

    new LoaderUI(this).drawLoader();

    // TODO: make sprites

    this.load.image("playerGear", gearURL);
    this.load.image("plaerMagnetGear", magnetGearURL);
    this.load.image("playerCoilMagnetGear", coilMagnetGearURL);

    this.load.image("oil", oilURL);
    this.load.image("magnet", magnetURL);
    this.load.image("coil", coilURL);

    this.load.image("ground", groundURL);
  }

  create() {
    this.scene.start("MenuScene");
  }
}
