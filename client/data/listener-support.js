// @ts-check

/**
 * A class for things we can register listeners to and fire events
 * @author Mike North
 * @public
 */
export default class ListenerSupport {
  constructor() {
    this._listeners = []
  }
  
  /**
   * Register a listener
   * @param {function} listener callback to invoke whenever listeners need to be notified
   * @return {void}
   */
  register(listener) {
    this._listeners.push(listener);
  }

  /**
   * Un-register a listener
   * @param {function} listener callback that should no longer be invoked when events are fired
   * @return {void}
   */
  unregister(listener) {
    let idx = this._listeners.findIndex((x) => x === listener);
    this._listeners.splice(idx, 1);
  }

  /**
   * Fire an event, synchronously invoking all listener callbacks that have been registered
   * @see #register 
   * @param {any} payload 
   */
  fire(payload) {
    this._listeners.forEach((x) => x(payload));
  }
}