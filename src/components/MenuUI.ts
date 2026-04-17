import { Scene } from "phaser";
import Label from "phaser4-rex-plugins/templates/ui/label/Label";
import Sizer from "phaser4-rex-plugins/templates/ui/sizer/Sizer";

export interface IMenuConfig {
  buttons: IMenuButton[];
}

export interface IMenuButton {
  label: string;
  onClick: () => void;
}

export class MenuUI {
  scene: Scene;
  protected _config: IMenuConfig;
  protected _container: Sizer | null;
  protected _buttons: Label[] = [];

  constructor(scene: Scene, config: IMenuConfig) {
    this.scene = scene;
    this._config = config;
  }

  create(): void {
    const { width: cWidth, height: cHeight } = this.scene.scale;

    this._container = this.scene.rexUI.add.sizer({
      x: cWidth / 2,
      y: cHeight / 2,
      orientation: "y",
      space: { item: 28 }
    });

    this._config.buttons.forEach(btnConfig => {
      const btn = this.createButton(btnConfig.label).on("pointerup", btnConfig.onClick);

      this._buttons.push(btn);
      this._container!.add(btn);
    });

    this._container.layout();

    this.animateIn(this._container);
  }

  private createButton(text: string): Label {
    const bg = this.scene.add.rectangle(0, 0, 260, 60, 0x1e1e1e, 1);

    const label = this.scene.rexUI.add.label({
      width: 390,
      height: 90,

      background: bg,

      text: this.scene.add.text(0, 0, text, {
        fontSize: "34px",
        color: "#ffffff"
      }),

      align: "center"
    });

    label.setScale(0.95);
    label.setAlpha(0.9);

    label.setInteractive();

    label.on("pointerover", () => {
      this.scene.tweens.add({
        targets: label,
        scale: 1.05,
        alpha: 1,
        duration: 120,
        ease: "Sine.easeOut"
      });

      bg.setFillStyle(0x2f2f2f);
    });

    label.on("pointerout", () => {
      this.scene.tweens.add({
        targets: label,
        scale: 0.95,
        alpha: 0.9,
        duration: 120,
        ease: "Sine.easeOut"
      });

      bg.setFillStyle(0x1e1e1e);
    });

    label.on("pointerdown", () => {
      this.scene.tweens.add({
        targets: label,
        scale: 0.9,
        duration: 80,
        yoyo: true
      });
    });

    return label;
  }

  private animateIn(container: Sizer): void {
    container.setAlpha(0);
    container.setScale(0.9);

    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: "Back.out"
    });
  }

  destroy(): void {
    this._buttons.forEach(btn => {
      btn.removeAllListeners();
      btn.destroy();
    });
    this._buttons = [];

    if (this._container) {
      this._container.destroy(true);
      this._container = null;
    }
  }
}
