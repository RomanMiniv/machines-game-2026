import { Scene } from "phaser";
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

  constructor() {
    super("LoreManagerScene");
  }

  create() {
    this.startLore();

    this.scene.get("GameScene").events.once("complete", async () => {
      this.startNextScene();

      const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

      this.scene.bringToTop("TransitionScene");
      await transitionScene.fadeIn();
    });
  }

  private async startLore() {
    this._index = -1;
    this.startNextScene();

    const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

    this.scene.bringToTop("TransitionScene");
    await transitionScene.fadeIn();
  }

  startNextScene() {
    this._index++;

    const SceneClass = this._loreFlow[this._index].scene;
    const key = `Lore_${this._index}`;

    const scene = this.scene.add(key, SceneClass, true) as Scene;

    scene.events.once("complete", () => {
      this.onSceneComplete(scene);
    });
  }

  private async onSceneComplete(scene: Phaser.Scene) {
    const transitionScene = this.scene.get("TransitionScene") as TransitionScene;

    this.scene.bringToTop("TransitionScene");
    await transitionScene.fadeOut();

    this.scene.remove(scene.scene.key);

    switch (this._loreFlow[this._index].key) {
      case ELoreSceneKeys.LoreHopeScene:
        this.scene.sleep("LoreManagerScene");
        this.scene.start("GameScene");
        break;
      case ELoreSceneKeys.LoreOutroScene:
        this.scene.start("CreditsScene");
        break;
      default:
        this.startNextScene();
        break;
    }

    this.scene.bringToTop("TransitionScene");
    await transitionScene.fadeIn();
  }
}
