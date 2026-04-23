import { Scene } from "phaser";

export abstract class LoreScene extends Scene {
  protected finish() {
    this.input.enabled = false;
    this.events.emit("complete");
  }
}
