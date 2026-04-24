export type TAction = () => Promise<unknown>;

export class ActionSystem {
  private _actions: TAction[];
  private _index: number;
  private _isRunning: boolean;

  init(actions: TAction[]) {
    this._actions = actions;
    this._index = 0;
    this._isRunning = false;
  }

  start(): void {
    if (this._isRunning) {
      return;
    }
    this._isRunning = true;

    this.runNext();
  }

  private runNext(): void {
    if (!this._isRunning) {
      return;
    }

    if (this._index >= this._actions.length) {
      this._isRunning = false;
      return;
    }

    const action = this._actions[this._index];
    this._index++;

    const result = action();

    result.then(() => this.runNext());
  }

  stop(): void {
    this._isRunning = false;
  }
}
