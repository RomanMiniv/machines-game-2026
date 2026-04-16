import Phaser from "phaser";
import TestScene from "./scenes/TestScene/TestScene";

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
  scene: [TestScene],
};

const game = new Phaser.Game(config);
