import { Scene } from "phaser";

import { LoaderUI } from "../components/LoaderUI";

// images

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
import fieldMagneticURL from "@assets/images/entities/player/fieldMagnetic.png";
import fieldElectromagneticURL from "@assets/images/entities/player/fieldElectromagnetic.png";

import oilURL from "@assets/images/stuff/oil.png";
import magnetURL from "@assets/images/stuff/magnet.png";
import coilURL from "@assets/images/stuff/coil.png";

import robotURL from "@assets/images/entities/robot/robot.png";
import robotConfig from "@assets/images/entities/robot/robot.json";
import beamURL from "@assets/images/stuff/beam.png";
import explosionURL from "@assets/images/entities/explosion.png";

import droneURL from "@assets/images/entities/drone/drone.png";
import droneConfig from "@assets/images/entities/drone/drone.json";

import backgroundSkyURL from "@assets/images/background/backgroundSky.png";
import backgroundCityURL from "@assets/images/background/backgroundCity.png";
import groundURL from "@assets/images/background/road.png";

// music

import musicIntroURL from "@assets/audio/music/MUSIC_Begin_#1.ogg";
import musicIntroFallbackURL from "@assets/audio/music/MUSIC_Begin_#1.mp3";

import musicIntroLoopURL from "@assets/audio/music/MUSIC_Begin_Loop.ogg";
import musicIntroLoopFallbackURL from "@assets/audio/music/MUSIC_Begin_Loop.mp3";

import musicOutroLoopURL from "@assets/audio/music/MUSIC_Ending_Loop.ogg";
import musicOutroLoopFallbackURL from "@assets/audio/music/MUSIC_Ending_Loop.mp3";

import musicGameURL from "@assets/audio/music/MUSIC_Gameplay_#1.ogg";
import musicGameFallbackURL from "@assets/audio/music/MUSIC_Gameplay_#1.mp3";

import musicGameLoopURL from "@assets/audio/music/MUSIC_Gameplay_Loop.ogg";
import musicGameLoopFallbackURL from "@assets/audio/music/MUSIC_Gameplay_Loop.mp3";

// sound FX

import buttonSound1URL from "@assets/audio/soundFX/Button1.ogg";
import buttonSound1FallbackURL from "@assets/audio/soundFX/Button1.mp3";

import buttonSound2URL from "@assets/audio/soundFX/Button2.ogg";
import buttonSound2FallbackURL from "@assets/audio/soundFX/Button2.mp3";

import beetleSoundURL from "@assets/audio/soundFX/Bug_2.ogg";
import beetleSoundFallbackURL from "@assets/audio/soundFX/Bug_2.mp3";

import playerMoveSoundURL from "@assets/audio/soundFX/Character_Moving.ogg";
import playerMoveSoundFallbackURL from "@assets/audio/soundFX/Character_Moving.mp3";
import playerJumpSoundURL from "@assets/audio/soundFX/Jump.ogg";
import playerJumpSoundFallbackURL from "@assets/audio/soundFX/Jump.mp3";

import electromagnetSoundURL from "@assets/audio/soundFX/Electronic_Shock.ogg";
import electromagnetSoundFallbackURL from "@assets/audio/soundFX/Electronic_Shock.mp3";
import magnetSoundURL from "@assets/audio/soundFX/Magnetic_Shock.ogg";
import magnetSoundFallbackURL from "@assets/audio/soundFX/Magnetic_Shock.mp3";
import oilDropSoundURL from "@assets/audio/soundFX/OilDrop.ogg";
import oilDropSoundFallbackURL from "@assets/audio/soundFX/OilDrop.mp3";

import enemyDestroyedSoundURL from "@assets/audio/soundFX/Enemy_Destroyed.ogg";
import enemyDestroyedSoundFallbackURL from "@assets/audio/soundFX/Enemy_Destroyed.mp3";
import laserSoundURL from "@assets/audio/soundFX/Laser3.ogg";
import laserSoundFallbackURL from "@assets/audio/soundFX/Laser3.mp3";

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
    this.load.image("playerFieldMagnetic", fieldMagneticURL);
    this.load.image("playerFieldElectromagnetic", fieldElectromagneticURL);

    this.load.atlas("robot", robotURL, robotConfig);
    this.load.image("beam", beamURL);
    this.load.image("explosion", explosionURL);

    this.load.atlas("drone", droneURL, droneConfig);

    this.load.image("oil", oilURL);
    this.load.image("magnet", magnetURL);
    this.load.image("coil", coilURL);

    this.load.image("backgroundSky", backgroundSkyURL);
    this.load.image("backgroundCity", backgroundCityURL);

    this.load.image("ground", groundURL);

    this.load.audio("musicIntro", [musicIntroURL, musicIntroFallbackURL]);
    this.load.audio("musicIntroLoop", [musicIntroLoopURL, musicIntroLoopFallbackURL]);
    this.load.audio("musicOutroLoop", [musicOutroLoopURL, musicOutroLoopFallbackURL]);
    this.load.audio("musicGame", [musicGameURL, musicGameFallbackURL]);
    this.load.audio("musicGameLoop", [musicGameLoopURL, musicGameLoopFallbackURL]);

    this.load.audio("soundButton1", [buttonSound1URL, buttonSound1FallbackURL]);
    this.load.audio("soundButton2", [buttonSound2URL, buttonSound2FallbackURL]);

    this.load.audio("beetleSound", [beetleSoundURL, beetleSoundFallbackURL]);

    this.load.audio("playerMoveSound", [playerMoveSoundURL, playerMoveSoundFallbackURL]);
    this.load.audio("playerJumpSound", [playerJumpSoundURL, playerJumpSoundFallbackURL]);

    this.load.audio("electromagnetSound", [electromagnetSoundURL, electromagnetSoundFallbackURL]);
    this.load.audio("magnetSound", [magnetSoundURL, magnetSoundFallbackURL]);
    this.load.audio("oilDropSound", [oilDropSoundURL, oilDropSoundFallbackURL]);

    this.load.audio("enemyDestroyedSound", [enemyDestroyedSoundURL, enemyDestroyedSoundFallbackURL]);
    this.load.audio("laserSound", [laserSoundURL, laserSoundFallbackURL]);
  }

  create() {
    this.scene.launch("TransitionScene");
    this.scene.start("MenuScene");
  }
}
