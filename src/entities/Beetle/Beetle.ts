import { Scene, Textures, GameObjects, Types } from "phaser";

export class Beetle extends GameObjects.Image {
  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "beetle", frame);
    scene.add.existing(this);
  }

  async move(toPos: Types.Math.Vector2Like, duration: number, captureObject?: GameObjects.Image): Promise<void> {
    const beetleSound = this.scene.sound.add("beetleSound", { loop: true, volume: .7, });
    beetleSound.play();

    const fromX = this.x;
    const fromY = this.y;

    const dx = toPos.x - fromX;
    const dy = toPos.y - fromY;

    const length = Math.sqrt(dx * dx + dy * dy);

    const dirX = dx / length;
    const dirY = dy / length;

    const perpX = -dirY;
    const perpY = dirX;

    let prevX = fromX;
    let prevY = fromY;

    await new Promise<void>(resolve => {
      this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration,
        ease: "Sine.easeInOut",
        onUpdate: (tween) => {
          const t = tween.getValue() ?? 1;

          let x = fromX + dx * t;
          let y = fromY + dy * t;

          const noise = Math.sin(t * 20) * 10 + Math.sin(t * 7) * 5;

          x += perpX * noise;
          y += perpY * noise;

          this.setPosition(x, y);

          const angle = Math.atan2(y - prevY, x - prevX);
          this.setRotation(angle + Math.PI);

          prevX = x;
          prevY = y;

          captureObject?.setPosition(x, y);
        },
        onComplete: () => {
          beetleSound.stop();
          beetleSound.destroy();
          resolve();
        },
      });
    });
  }
}
