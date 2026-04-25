import { Physics, Types } from "phaser";
import { Robot } from "./Robot";
import { Lazer } from "./stuff/Lazer";
import { Player } from "../Player/Player";

export class RobotManager extends Physics.Arcade.Group {
  lazerGroup: Physics.Arcade.Group;

  constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, children?: Phaser.GameObjects.GameObject[] | Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig, config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig) {
    super(world, scene, children, config);

    this.lazerGroup = this.scene.physics.add.group({
      runChildUpdate: true,
    });
  }

  populate(pos: Types.Math.Vector2Like): void {
    const robot = new Robot(this.scene, pos.x, pos.y);
    robot.init(this.lazerGroup);

    this.add(robot);
  }

  update(time: number, delta: number) {
    this.updateRobots(time, delta);
    this.updateLazers();
  }

  updateRobots(time: number, delta: number): void {
    const robots = this.getChildren() as Robot[];

    for (let i = 0; i < robots.length; i++) {
      const robot = robots[i];

      if (!robot.active) {
        continue;
      }

      robot.update(time, delta);
    }
  }

  updateLazers(): void {
    this.lazerGroup.children.forEach(lazer => {
      if (!this.scene.cameras.main.worldView.contains((lazer as Lazer).x, (lazer as Lazer).y)) {
        this.lazerGroup.remove(lazer, true, true);
      }
    });
  }
}
