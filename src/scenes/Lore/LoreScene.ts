import { Scene } from "phaser";

export abstract class LoreScene extends Scene {
  protected finish() {
    this.events.emit("complete");
  }
}
