import { ADD, REMOVE, TOGGLE, HIDDEN } from './constants';
import prepare from './animate';
import validator from './validator';
import * as error from './error';

export default function queue(animation, deferred = Promise.resolve(), cancelled = false) {
  if (animation && !cancelled) {
    try {
      validator(...animation);
      let prepared = prepare(...animation);
      deferred = (async () => {
        await deferred;
        try {
          await prepared();
        } catch (e) {
          error.handle(e);
        }
      })();
    } catch (e) {
      cancelled = true;
      error.handle(e);
    }
  }
  return {
    [ADD]: (...args) => queue([ADD, ...args], deferred, cancelled),
    [REMOVE]: (...args) => queue([REMOVE, ...args], deferred, cancelled),
    [TOGGLE]: (...args) => queue([TOGGLE, ...args], deferred, cancelled),
    show: target => queue([REMOVE, target, HIDDEN], deferred, cancelled),
    hide: target => queue([ADD, target, HIDDEN], deferred, cancelled),
  };
}
