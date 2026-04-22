import { Physics, Scene, Textures } from "phaser";

export class CoilPickup extends Physics.Arcade.Image {
  constructor(scene: Scene, x: number, y: number, texture?: string | Textures.Texture, frame?: string | number) {
    super(scene, x, y, texture ?? "coil", frame);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}
