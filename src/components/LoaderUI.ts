import { Scene } from "phaser";

export class LoaderUI {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  drawLoader(): void {
    const { width: cWidth, height: cHeight } = this.scene.scale;

    const progressBarWidth = cWidth / 5;
    const progressBarHeight = progressBarWidth / 6;

    const loaderContainer = this.scene.add.container(cWidth / 2, cHeight / 2);

    // progressBarBg
    const progressBarBg = this.scene.add.rectangle(0, 0, progressBarWidth, progressBarHeight)
      .setStrokeStyle(1, 0xffffff);
    loaderContainer.add(progressBarBg);

    // progressBar
    const progressBar = this.scene.add.rectangle(0, 0, progressBarWidth, progressBarHeight)
      .setFillStyle(0xffffff);
    loaderContainer.add(progressBar);

    // loadingText
    const loadingText = this.scene.add.text(-progressBarWidth / 2, -progressBarHeight - 10, "", {});
    loadingText.text = "Loading...";
    loadingText.setStyle({ "color": "#ffffff", "fontFamily": "arial", "fontSize": "24px" });
    loaderContainer.add(loadingText);

    // icon
    const icon = this.scene.add.image(0, 0, "loaderGear")
      .setScale(.1)
      .setTintMode(Phaser.TintModes.FILL);
    icon.y = progressBarHeight + icon.displayHeight / 2;

    const iconTween = this.scene.tweens.add({
      targets: icon,
      angle: 360,
      duration: 5000,
      repeat: -1
    });

    loaderContainer.add(icon);

    // loader events
    const onProgressHandler = (value: number) => {
      progressBar.width = progressBarWidth * value;
    };
    this.scene.load.on("progress", onProgressHandler);

    this.scene.load.once("complete", (value: number) => {
      this.scene.load.off("progress", onProgressHandler);
      iconTween.destroy();
      loaderContainer.destroy();
    });
  }
}
