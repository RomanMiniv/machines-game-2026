import { Scene } from "phaser";

import { LoaderUI } from "../components/LoaderUI";

import loreIntroURL from "@assets/images/lore/scene0.png";

import loreStartURL from "@assets/images/lore/scene1.png";
import programmerURL from "@assets/images/lore/programmer.png";
import beetleURL from "@assets/images/lore/beetle.png";
import computerURL from "@assets/images/lore/computer.png";
import loreHopeURL from "@assets/images/lore/scene2.png";
import engineerURL from "@assets/images/lore/engineer.png";
import superMachineURL from "@assets/images/lore/superMachine.png";
import switchOnURL from "@assets/images/lore/switch_on.png";
import switchOffURL from "@assets/images/lore/switch_off.png";

import gearURL from "@assets/images/entities/player/gear.png";
import magnetGearURL from "@assets/images/entities/player/magnetGear.png";
import coilMagnetGearURL from "@assets/images/entities/player/coilMagnetGear.png";
import gearCopperURL from "@assets/images/entities/player/gearCopper.png";

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
import groundURL from "@assets/images/background/road.png";

import musicIntroURL from "@assets/audio/music/MUSIC_Begin_#1.ogg";
import musicIntroLoopURL from "@assets/audio/music/MUSIC_Begin_Loop.ogg";
import musicOutroURL from "@assets/audio/music/MUSIC_Ending_#1.ogg";
import musicOutroLoopURL from "@assets/audio/music/MUSIC_Ending_Loop.ogg";
import musicGameURL from "@assets/audio/music/MUSIC_Gameplay_Placeholder1.ogg";
import musicGameLoopURL from "@assets/audio/music/MUSIC_Gameplay_Placeholder2.ogg";

import buttonSound1URL from "@assets/audio/soundFX/Button1.ogg";
import buttonSound2URL from "@assets/audio/soundFX/Button2.ogg";

import beetleSoundURL from "@assets/audio/soundFX/Bug_2.ogg";

import playerMoveSoundURL from "@assets/audio/soundFX/Character_Moving.ogg";
import playerJumpSoundURL from "@assets/audio/soundFX/Jump.ogg";

import electromagnetSoundURL from "@assets/audio/soundFX/Electronic_Shock.ogg";
import magnetSoundURL from "@assets/audio/soundFX/Magnetic_Shock.ogg";
import oilDropSoundURL from "@assets/audio/soundFX/OilDrop_1.ogg";

import enemyDestroyedSoundURL from "@assets/audio/soundFX/Enemy_Destroyed.ogg";
import laserSoundURL from "@assets/audio/soundFX/Laser3.ogg";

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

    this.load.image("loreIntro", loreIntroURL);

    this.load.image("loreStart", loreStartURL);
    this.load.image("programmer", programmerURL);
    this.load.image("beetle", beetleURL);
    this.load.image("computer", computerURL);
    this.load.image("loreHope", loreHopeURL);
    this.load.image("engineer", engineerURL);
    this.load.image("superMachine", superMachineURL);
    this.load.image("switchOn", switchOnURL);
    this.load.image("switchOff", switchOffURL);

    this.load.image("playerGear", gearURL);
    this.load.image("plaerMagnetGear", magnetGearURL);
    this.load.image("playerCoilMagnetGear", coilMagnetGearURL);
    this.load.image("playerGearCopper", gearCopperURL);

    this.load.atlas("robot", robotURL, robotConfig);
    this.load.image("beam", beamURL);

    this.load.atlas("drone", droneURL, droneConfig);

    this.load.image("oil", oilURL);
    this.load.image("magnet", magnetURL);
    this.load.image("coil", coilURL);

    this.load.image("backgroundSky", backgroundSkyURL);
    this.load.image("backgroundCity", backgroundCityURL);

    this.load.image("ground", groundURL);

    this.load.audio("musicIntro", musicIntroURL);
    this.load.audio("musicIntroLoop", musicIntroLoopURL);
    this.load.audio("musicOutro", musicOutroURL);
    this.load.audio("musicOutroLoop", musicOutroLoopURL);
    this.load.audio("musicGame", musicGameURL);
    this.load.audio("musicGameLoop", musicGameLoopURL);

    this.load.audio("soundButton1", buttonSound1URL);
    this.load.audio("soundButton2", buttonSound2URL);

    this.load.audio("beetleSound", beetleSoundURL);

    this.load.audio("playerMoveSound", playerMoveSoundURL);
    this.load.audio("playerJumpSound", playerJumpSoundURL);

    this.load.audio("electromagnetSound", electromagnetSoundURL);
    this.load.audio("magnetSound", magnetSoundURL);
    this.load.audio("oilDropSound", oilDropSoundURL);

    this.load.audio("enemyDestroyedSound", enemyDestroyedSoundURL); // to add
    this.load.audio("laserSound", laserSoundURL);
  }

  create() {
    this.scene.launch("TransitionScene");
    this.scene.start("MenuScene");
  }
}
