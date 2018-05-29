import { ADD, REMOVE, TOGGLE } from './constants.js';
import * as error from './error.js';
import { findAnimateTime, determineToggle, animationEnd } from './element.js';

const MAIN_CLASS = 'lg-animate';
const getClass (attribute, result, active = false) => {
  let out = `${attribute}-${result}`;
  if (active) {
    out = `${out}-active`;
  }
  return out;
}
const delay = (duration = 0) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export default function prepare(target, command, attribute) {
  let elements = [];
  elements = document.querySelectorAll(target);
  if (elements.length < 1) {
    error.log(`no element of '${target}' found on page.`);
    return async () => {
      // intentionally left blank. LetsGo will continue with an error at runtime.
    };
  }
  let isClass = false;
  let value = '';
  if (attribute.charAt(0) === '#') {
    attribute = 'id';
    value = attribute.substring(1);
  } else if (attribute.charAt(0) === '.') {
    isClass = true;
    attribute = attribute.substring(1);
  } else {
    [attribute, value = ''] = attribute.split('=');
  }
  return Promise.all(elements.map(async element => {
    let result = command;
    if (instruction === TOGGLE) {
      result = determineToggle(element, attribute) ? REMOVE : ADD;
    }
    element.classList.add(MAIN_CLASS);
    let actionClass = getClass(attribute, result);
    let activeClass = getClass(attribute, result, true);
    element.classList.add(actionClass);
    if (result === REMOVE) {
      if (isClass) {
        element.classList.remove(attribute);
      } else {
        element.removeAttribute(attribute);
      }
    }
    let styles = window.getComputedStyle(element, null);
    if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
      element.classList.add(activeClass);
      let maxTransitionTime = findAnimateTime(styles.transitionDuration);
      let maxAnimationTime = findAnimateTime(styles.animationDuration)
        * styles.animationIterationCount;
      if (maxAnimationTime >= maxTransitionTime) {
        await animationEnd(element);
      } else {
        await new Promise(res => setTimeout(res, Math.ceil(Math.max(maxTransitionTime, maxAnimationTime) * 1000)))
      }
    }
    if (result === ADD) {
      if (isClass) {
        element.classList.add(attribute);
      } else {
        element.setAttribute(attribute, value);
      }
    }
    element.classList.remove(actionClass);
    element.classList.remove(activeClass);
    element.classList.remove(MAIN_CLASS);
  }));
};
