/* letsGo
 * https://letsgojs.com/
 *
 * By: Cody Sherman <cody@beg.in> (codysherman.com)
 */
(((window, document) => {
  let error = function() {
    window.console.error(...arguments);
  };

  let masterQueue = {};
  let masterId = 0;

  let letsGo = (target, command, modifier, newQueue) => {
    let activeId = null;

    let nextInQueue = lastOne => {
      if (lastOne) {
        masterQueue[activeId].queue.shift();
        if (masterQueue[activeId].queue.length > 0) {
          router();
        } else {
          masterQueue[activeId].running = false;
          // delete masterQueue[activeId];
        }
      }
    };

    let checkIfAttribute = (element, modifier, attributeIsClass) => {
      if (!modifier || attributeIsClass) {
        modifier = (modifier) ? modifier : 'lg-hide';
        return ` ${element.className} `.includes(` ${modifier} `);
      } else if (modifier.includes('=')) {
        modifier = modifier.split('=');
        return (element.hasAttribute(modifier[0])) && (element.getAttribute(modifier[0]) === modifier[1]);
      } else {
        return (element.hasAttribute(modifier) && (element.getAttribute(modifier) === ''));
      }
    };

    let findAnimateTime = times => {
      if (times.includes(',')) {
        times = times.split(',');
        for (let i = 0; i < times.length; i++) {
          times[i] = Number(times[i].slice(0, -1));
        }
        times = Math.max.apply(null, times);
      } else {
        times = Number(times.slice(0, -1));
      }
      return times;
    };

    let alterModifier = (element, styles, add, modifier, attributeIsClass, lastOne) => {
      let command = (add) ? 'add' : 'remove';

      if (attributeIsClass) {
        let alterAttributeDone = () => {
          element.removeEventListener('animationend', alterAttributeDone, false);
          if (add) {
            element.classList.add(modifier);
          }
          element.classList.remove(`${modifier}-${command}`);
          element.classList.remove(`${modifier}-${command}-active`);
          element.classList.remove('lg-animate');
          nextInQueue(lastOne);
        };

        element.classList.add('lg-animate');
        element.classList.add(`${modifier}-${command}`);
        if (!add) {
          element.classList.remove(modifier);
        }
        setTimeout(() => {
          if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
            element.classList.add(`${modifier}-${command}-active`);
            let maxTransitionTime = findAnimateTime(styles.transitionDuration);
            let maxAnimationTime = findAnimateTime(styles.animationDuration) * styles.animationIterationCount;
            let maxTime = Math.ceil(Math.max(maxTransitionTime, maxAnimationTime)*1000);
            setTimeout(alterAttributeDone, maxTime);
            if (styles.animationDuration !== '0s') {
              element.addEventListener('animationend', alterAttributeDone, false);
            }
          } else {
            alterAttributeDone();
          }
        }, 0);
      } else {
        // let setTheAttribute = function() {
        //   element.setAttribute(modifier[0], modifier[1]);
        // }
        if (add) {
          if (modifier.includes('=')) {
             modifier = modifier.split('=');
             element.setAttribute(modifier[0], modifier[1]);
          } else {
            element.setAttribute(modifier, '');
          }
        } else {
          if (modifier.includes('=')) {
             modifier = modifier.split('=');
             element.removeAttribute(modifier[0]);
          } else {
            element.removeAttribute(modifier);
          }
        }
        nextInQueue(lastOne);
      }
    };

    let router = () => {
      let target = masterQueue[activeId].queue[0].target;
      let command = masterQueue[activeId].queue[0].command;
      let modifier = masterQueue[activeId].queue[0].modifier;
      let targetType = null;
      let attributeIsClass = null;
      let lastOne = false;
      if (target.charAt(0) === '#') {
        targetType = 'id';
        target = target.substring(1);
        let element = document.getElementById(target);
        if (element === null) {
          return error(`letsGo: no element of ${targetType} '${target}' found on page.`);
        }
        let styles = window.getComputedStyle(element, null);
        if ((command === 'add') || (command === 'remove')) {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = `id=${modifier.substring(1)}`;
          }
          if (command === 'add') {
            alterModifier(element, styles, true, modifier, attributeIsClass, true);
          } else if (command === 'remove') {
            alterModifier(element, styles, false, modifier, attributeIsClass, true);
          }
        } else if (command === 'toggle') {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = `id=${modifier.substring(1)}`;
          }
          if (checkIfAttribute(element, modifier, attributeIsClass)) {
            alterModifier(element, styles, false, modifier, attributeIsClass, true);
          } else {
            alterModifier(element, styles, true, modifier, attributeIsClass, true);
          }
        }
      } else {
        let element = [];
        if (target.charAt(0) === '.') {
          targetType = 'class';
          target = target.substring(1);
          element = document.getElementsByClassName(target);
        } else {
          targetType = 'tag';
          element = document.getElementsByTagName(target);
        }
        if (element.length < 1) {
          return error(`letsGo: no element of ${targetType} '${target}' found on page.`);
        }
        if ((command === 'add') || (command === 'remove')) {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = `id=${modifier.substring(1)}`;
          }
          if (command === 'add') {
            for (let i = 0; i < element.length; i++) {
              let styles = window.getComputedStyle(element[i], null);
              if (i === (element.length - 1) ) {
                lastOne = true;
              }
              alterModifier(element[i], styles, true, modifier, attributeIsClass, lastOne);
            }
          } else if (command === 'remove') {
            for (let i = 0; i < element.length; i++) {
              let styles = window.getComputedStyle(element[i], null);
              if (i === (element.length - 1) ) {
                lastOne = true;
              }
              alterModifier(element[i], styles, false, modifier, attributeIsClass, lastOne);
            }
          }
        } else if (command === 'toggle') {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = `id=${modifier.substring(1)}`;
          }
          for (let i = 0; i < element.length; i++) {
            let styles = window.getComputedStyle(element[i], null);
            if (i === (element.length - 1) ) {
              lastOne = true;
            }
            if (checkIfAttribute(element[i], modifier, attributeIsClass)) {
              alterModifier(element[i], styles, false, modifier, attributeIsClass, lastOne);
            } else {
              alterModifier(element[i], styles, true, modifier, attributeIsClass, lastOne);
            }
          }
        }
      }
    };

    if (newQueue) {
      activeId = ++masterId;
      masterQueue[activeId] = {running: false, queue: []};
    }
    // setTimeout(function() {
      activeId = activeId || masterId;
      masterQueue[activeId].queue.push({target, command, modifier});
      if (!masterQueue[activeId].running) {
        masterQueue[activeId].running = true;
        router();
      }
    // }, 0);
  };

  let validator = (command, target, modifier) => {
    if (!target) {
      error('letsGo: missing \'target\' parameter');
      return {validated: false};
    } else if (typeof target !== 'string') {
      error('letsGo: \'target\' parameter is not a string type');
      return {validated: false};
    } else if ((command === 'add' || command === 'remove') && !modifier) {
      error('letsGo: using \'add\' or \'remove\' commands must also have a \'modifier\' parameter');
      return {validated: false};
    } else {
      return {validated: true, command, target, modifier: modifier || '.lg-hide'};
    }
  };

  class addToQueue {
    constructor(input, newQueue) {
      if (input.validated !== true) {
        // TODO: skip code here
      }
      letsGo(input.target, input.command, input.modifier, newQueue);
      return addToQueue;
    }

    static add(target, modifier, newQueue) {
      return addToQueue(validator('add', target, modifier), newQueue);
    }

    static remove(target, modifier, newQueue) {
      return addToQueue(validator('remove', target, modifier), newQueue);
    }

    static toggle(target, modifier, newQueue) {
      return addToQueue(validator('toggle', target, modifier), newQueue);
    }

    static show(target) {
      return addToQueue.remove(target, '.lg-hide');
    }

    static hide(target) {
      return addToQueue.add(target, '.lg-hide');
    }
  }

  let api = {};
  api.add = (target, modifier) => addToQueue.add(target, modifier, true);
  api.remove = (target, modifier) => addToQueue.remove(target, modifier, true);
  api.toggle = (target, modifier) => addToQueue.toggle(target, modifier, true);
  api.show = target => addToQueue.remove(target, '.lg-hide', true);
  api.hide = target => addToQueue.add(target, '.lg-hide', true);

  window.letsgo = api;
}))(window, document);
