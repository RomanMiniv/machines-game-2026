import { Scene } from "phaser";

import { LoaderUI } from "../components/LoaderUI";

import gearURL from "@assets/images/entities/player/gear.png";
import magnetGearURL from "@assets/images/entities/player/magnetGear.png";
import coilMagnetGearURL from "@assets/images/entities/player/coilMagnetGear.png";

import oilURL from "@assets/images/stuff/oil.png";
import magnetURL from "@assets/images/stuff/magnet.png";
import coilURL from "@assets/images/stuff/coil.png";

import robotURL from "@assets/images/entities/robot/robot.png";
import robotConfig from "@assets/images/entities/robot/robot.json";
import beamURL from "@assets/images/stuff/beam.png";

import droneURL from "@assets/images/entities/drone/drone.png";
import droneConfig from "@assets/images/entities/drone/drone.json";

import backgroundSkyURL from "@assets/images/background/backgroundSky.png";
import backgroundCityURL from "@assets/images/background/backgroundCity.png";
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

    this.load.atlas("robot", robotURL, robotConfig);
    this.load.image("beam", beamURL);
    
    this.load.atlas("drone", droneURL, droneConfig);

    this.load.image("oil", oilURL);
    this.load.image("magnet", magnetURL);
    this.load.image("coil", coilURL);

    this.load.image("backgroundSky", backgroundSkyURL);
    this.load.image("backgroundCity", backgroundCityURL);
    
    this.load.image("ground", groundURL);
  }

  create() {
    this.scene.start("MenuScene");
  }
}
