import { Scene } from "phaser";
import { ActionSystem } from "../../components/ActionSystem";

export abstract class LoreScene extends Scene {
  protected _actionSysyem: ActionSystem = new ActionSystem();

  private _textObject?: Phaser.GameObjects.Container;

  protected async showText(text: string, config?: {
    x?: number;
    y?: number;
    duration?: number;
    isSkipped?: boolean;
  }) {
    const { width, height } = this.scale;

    if (!this._textObject) {
      this._textObject = this.add.container(
        config?.x ?? width / 2,
        config?.y ?? height - 120,
      ).setScrollFactor(0);

      const mainText = this.add.text(0, 0, "", {
        fontSize: "36px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: width * 0.8 }
      }).setOrigin(.5);
      this._textObject.add(mainText);
    }

    const skipText = this._textObject.list[1] as Phaser.GameObjects.Text;
    if (config?.isSkipped && !skipText) {
      const skipText = this.add.text(0, 60, "[Сlick to continue]", {
        fontSize: "24px",
        color: "#ff0000",
        align: "center",
      }).setOrigin(0.5);
      this._textObject.add(skipText);
    } else if (!config?.isSkipped) {
      if (skipText) {
        this._textObject.remove(skipText, true);
      }
    }

    const obj = this._textObject;

    obj.setAlpha(0);
    obj.setScale(0.98);

    const mainText = this._textObject.list[0] as Phaser.GameObjects.Text;
    mainText.setText(text);

    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: obj,
        alpha: 1,
        scale: 1,
        duration: config?.duration ?? 400,
        ease: "Sine.easeOut",
        onComplete: () => resolve()
      });
    });
  }

  protected async hideText(duration: number = 300) {
    if (!this._textObject) return;

    await new Promise<void>(resolve => {
      this.tweens.add({
        targets: this._textObject,
        alpha: 0,
        duration,
        ease: "Sine.easeIn",
        onComplete: () => resolve()
      });
    });
  }

  protected finish() {
    this.input.enabled = false;

    this._actionSysyem.stop();

    this.events.emit("complete");
  }

  delayedCallSync(duration: number): Promise<void> {
    return new Promise(resolve => this.time.delayedCall(duration, resolve));
  };
  waitClick(): Promise<void> {
    return new Promise<void>(resolve => {
      this.input.once("pointerdown", () => {
        this.sound.play("soundButton2", { volume: .5 });
        resolve();
      });
    });
  };
}
