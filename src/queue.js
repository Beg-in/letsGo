import { ADD, REMOVE, TOGGLE, HIDDEN } from './constants.js';
import exec from './exec.js';
import validator from './validator.js';
import { handle } from './error';

export default function queue(animation, deferred = Promise.resolve(), cancelled = false) {
  if (animation && !cancelled) {
    if (validator(...animation)) {
      let prepared = prepare(...animation);
      deferred = (async () => {
        await deferred;
        try {
          await prepared();
        } catch (e) {
          handle(e);
        }
      })();
    } else {
      cancelled = true;
    }
  }
  return {
    [ADD]: (...args) => queue([ADD, ...args], deferred, cancelled),
    [REMOVE]: (...args) => queue([REMOVE, ...args], deferred, cancelled),
    [TOGGLE]: (...args) => queue([TOGGLE, ...args], deferred, cancelled),
    show: target => queue([ADD, target, HIDDEN], deferred, cancelled),
    hide: target => queue([REMOVE, target, HIDDEN], deferred, cancelled),
  };
};
