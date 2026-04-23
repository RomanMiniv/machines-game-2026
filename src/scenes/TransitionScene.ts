import { Cameras, Scene } from "phaser";

export class TransitionScene extends Scene {
  constructor() {
    super({
      key: "TransitionScene",
    });
  }

  async fadeIn(duration: number = 1000): Promise<void> {
    return new Promise<void>(resolve => {
      this.cameras.main.once(Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
        resolve();
      });
      this.cameras.main.fadeIn(duration);
    });
  }
  async fadeOut(duration: number = 1000): Promise<void> {
    return new Promise<void>(resolve => {
      this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        resolve();
      });
      this.cameras.main.fadeOut(duration);
    });
  }
}
