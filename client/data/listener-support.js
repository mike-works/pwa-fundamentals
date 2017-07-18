// @ts-check

export default class ListenerSupport {
  constructor() {
    this._listeners = []
  }

  register(listener) {
    this._listeners.push(listener);
  }

  unregister(listener) {
    let idx = this._listeners.findIndex((x) => x === listener);
    this._listeners.splice(idx, 1);
  }

  fire(payload) {
    this._listeners.forEach((x) => x(payload));
  }
}