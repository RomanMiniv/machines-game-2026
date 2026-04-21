import Phaser from "phaser";

export class Oil {
  private _amount: number = 100;
  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = this.getNormalizedAmount(value);
  }

  max: number = 100;
  min: number = 0;
  drain = {
    speed: 5,
    time: 1000,
  };

  getNormalizedAmount(value: number): number {
    return Phaser.Math.Clamp(value, this.min, this.max);
  }

  collect(oilAmount: number): void {
    this.amount += oilAmount;
  }

  update(time: number, delta: number): void {
    this.amount -= this.drain.speed * (delta / this.drain.time);
  }
}
