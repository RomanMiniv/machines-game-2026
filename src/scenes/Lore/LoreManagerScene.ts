import { Scene, Sound } from "phaser";
import { LoreIntroScene } from "./LoreIntroScene";
import { LoreStartScene } from "./LoreStartScene";
import { LoreHopeScene } from "./LoreHopeScene";
import { LoreClimaxScene } from "./LoreClimaxScene";
import { LoreResolutionScene } from "./LoreResolutionScene";
import { LoreOutroScene } from "./LoreOutroScene";
import { LoreScene } from "./LoreScene";
import { TransitionScene } from "../TransitionScene";

export interface ILoreFlowItem {
  key: ELoreSceneKeys;
  scene: typeof LoreScene;
}

export enum ELoreSceneKeys {
  LoreIntroScene,
  LoreStartScene,
  LoreHopeScene,
  LoreClimaxScene,
  LoreResolutionScene,
  LoreOutroScene,
}

export class LoreManagerScene extends Scene {
  private _loreFlow: ILoreFlowItem[] = [
    { key: ELoreSceneKeys.LoreIntroScene, scene: LoreIntroScene },
    { key: ELoreSceneKeys.LoreStartScene, scene: LoreStartScene },
    { key: ELoreSceneKeys.LoreHopeScene, scene: LoreHopeScene },
    { key: ELoreSceneKeys.LoreClimaxScene, scene: LoreClimaxScene },
    { key: ELoreSceneKeys.LoreResolutionScene, scene: LoreResolutionScene },
    { key: ELoreSceneKeys.LoreOutroScene, scene: LoreOutroScene },
  ];

  private _index = -1;

  private readonly _musicVolume = .6;

  private _musicIntroStart: Sound.BaseSound | null;
  private _musicIntroLoop: Sound.BaseSound | null;

  private _musicOutroLoop: Sound.BaseSound | null;

  constructor() {
    super("LoreManagerScene");
  }

  create() {
    this.startLore();

    this.scene.get("GameScene").events.once("complete", async () => {
      const nextScene = this.startNextScene();

      const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

      this.scene.bringToTop("TransitionScene");
      await transitionScene.fadeIn();

      this._musicOutroLoop = this.sound.add("musicOutroLoop", { loop: true });
      this._musicOutroLoop.play({ volume: this._musicVolume });

      nextScene.scene.resume();
    });
  }

  private async startLore() {
    this._index = -1;
    const nextScene = this.startNextScene();

    const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

    this.scene.bringToTop("TransitionScene");
    await transitionScene.fadeIn();

    this._musicIntroStart = this.sound.add("musicIntro");

    this._musicIntroLoop = this.sound.add("musicIntroLoop", { loop: true });

    this._musicIntroStart.play({ volume: this._musicVolume });

    this._musicIntroStart.once("complete", () => {
      this._musicIntroLoop?.play({ volume: this._musicVolume });

      if (this._musicIntroStart) {
        this._musicIntroStart.destroy();
        this._musicIntroStart = null;
      }
    });

    nextScene.scene.resume();
  }

  startNextScene(): Scene {
    this._index++;

    const SceneClass = this._loreFlow[this._index].scene;
    const key = `Lore_${this._index}`;

    const scene = this.scene.add(key, SceneClass, true) as Scene;
    scene.scene.pause();

    scene.events.once("complete", () => {
      this.onSceneComplete(scene);
    });

    return scene;
  }

  private async onSceneComplete(scene: Phaser.Scene) {
    const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

    this.scene.bringToTop("TransitionScene");
    await transitionScene.fadeOut();

    this.scene.remove(scene.scene.key);

    let nextSceneKey: string | null = null;
    switch (this._loreFlow[this._index].key) {
      case ELoreSceneKeys.LoreHopeScene:
        if (this._musicIntroStart) {
          this._musicIntroStart.stop();
          this._musicIntroStart = null;
        }
        if (this._musicIntroLoop) {
          this._musicIntroLoop.stop();
          this._musicIntroLoop = null;
        }

        this.scene.sleep("LoreManagerScene");
        this.scene.start("GameScene");
        this.scene.pause("GameScene");
        nextSceneKey = "GameScene";
        break;
      case ELoreSceneKeys.LoreOutroScene:
        if (this._musicOutroLoop) {
          this._musicOutroLoop.stop();
          this._musicOutroLoop = null;
        }

        this.scene.start("CreditsScene");
        this.scene.pause("CreditsScene");
        nextSceneKey = "CreditsScene";
        break;
      default:
        nextSceneKey = this.startNextScene().scene.key;
        break;
    }

    this.scene.bringToTop("TransitionScene");
    await transitionScene.fadeIn();
    if (nextSceneKey) {
      this.scene.resume(nextSceneKey);
    }
  }
}
