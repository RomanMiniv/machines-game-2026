import { Physics, Scene, Textures } from "phaser";

export class OilPickup extends Physics.Arcade.Image {
  amount: number = 20;

  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "oil", frame);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}
