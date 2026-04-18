import Phaser from "phaser";
import RexUIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin.js";
import { TestScene } from "./scenes/TestScene/TestScene";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { CreditsScene } from "./scenes/CreditsScene";
import { OptionsScene } from "./scenes/OptionsScene";

const parent = document.getElementById("root") as HTMLDivElement;

const config: Phaser.Types.Core.GameConfig = {
  title: "machines-game-2026",
  parent: parent,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  disableContextMenu: true,
  type: Phaser.AUTO,
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI"
      }
    ]
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, OptionsScene, CreditsScene, TestScene],
};

const game = new Phaser.Game(config);
