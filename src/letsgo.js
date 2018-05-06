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

  let letsGo = (target, command, attribute, newQueue) => {
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

    let checkIfAlreadyAttribute = (element, attribute) => {
      if (attribute.charAt(0) === '.') {
        return ` ${element.className} `.includes(` ${attribute.substring(1)} `);
      } else if (attribute.includes('=')) {
        attribute = attribute.split('=');
        return (element.hasAttribute(attribute[0])) && (element.getAttribute(attribute[0]) === attribute[1]);
      } else {
        return (element.hasAttribute(attribute) && (element.getAttribute(attribute) === ''));
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

    let alterAttribute = (element, styles, command, attribute, lastOne) => {
      if (attribute.charAt(0) === '.') {
        attribute = attribute.substring(1);
        
        let alterAttributeDone = () => {
          element.removeEventListener('animationend', alterAttributeDone, false);
          if (command === 'add') {
            element.classList.add(attribute);
          }
          element.classList.remove(`${attribute}-${command}`);
          element.classList.remove(`${attribute}-${command}-active`);
          element.classList.remove('lg-animate');
          nextInQueue(lastOne);
        };

        element.classList.add('lg-animate');
        element.classList.add(`${attribute}-${command}`);
        if (command === 'remove') {
          element.classList.remove(attribute);
        }
        setTimeout(() => {
          if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
            element.classList.add(`${attribute}-${command}-active`);
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
        //   element.setAttribute(attribute[0], attribute[1]);
        // }
        if (command === 'add') {
          if (attribute.includes('=')) {
             attribute = attribute.split('=');
             element.setAttribute(attribute[0], attribute[1]);
          } else {
            element.setAttribute(attribute, '');
          }
        } else {
          if (attribute.includes('=')) {
             attribute = attribute.split('=');
             element.removeAttribute(attribute[0]);
          } else {
            element.removeAttribute(attribute);
          }
        }
        nextInQueue(lastOne);
      }
    };
    
    let router = () => {
      let target = masterQueue[activeId].queue[0].target;
      let command = masterQueue[activeId].queue[0].command;
      let attribute = masterQueue[activeId].queue[0].attribute;
      let lastOne = false;
      let element = [];
      element = document.querySelectorAll(target);
      if (element.length < 1) {
        return error(`letsGo: no element of '${target}' found on page.`);
      }
      if (attribute.charAt(0) === '#') {
        attribute = `id=${attribute.substring(1)}`;
      }
      for (let i = 0; i < element.length; i++) {
        let styles = window.getComputedStyle(element[i], null);
        if (i === (element.length - 1) ) {
          lastOne = true;
        }
        if (command === 'toggle') {
          command = checkIfAlreadyAttribute(element[i], attribute) ? 'remove' : 'add';
        }
        alterAttribute(element[i], styles, command, attribute, lastOne);
      }
    };

    if (newQueue) {
      activeId = ++masterId;
      masterQueue[activeId] = {running: false, queue: []};
    }
    // setTimeout(function() {
      activeId = activeId || masterId;
      masterQueue[activeId].queue.push({target, command, attribute});
      if (!masterQueue[activeId].running) {
        masterQueue[activeId].running = true;
        router();
      }
    // }, 0);
  };

  let validator = (command, target, attribute) => {
    if (!target) {
      error('letsGo: missing \'target\' parameter');
      return {validated: false};
    } else if (typeof target !== 'string') {
      error('letsGo: \'target\' parameter is not a string type');
      return {validated: false};
    } else if ((command === 'add' || command === 'remove') && !attribute) {
      error('letsGo: using \'add\' or \'remove\' commands must also have a \'attribute\' parameter');
      return {validated: false};
    } else {
      return {validated: true, command, target, attribute: attribute || '.lg-hide'};
    }
  };

  let addToQueue = (input, newQueue) => {
      if (input.validated !== true) {
        // TODO: skip code here
      } else {
        letsGo(input.target, input.command, input.attribute, newQueue);
      }
      return addToQueue;
  };

    addToQueue.add = (target, attribute, newQueue) => {
      return addToQueue(validator('add', target, attribute), newQueue);
    }

    addToQueue.remove = (target, attribute, newQueue) => {
      return addToQueue(validator('remove', target, attribute), newQueue);
    }

    addToQueue.toggle = (target, attribute, newQueue) => {
      return addToQueue(validator('toggle', target, attribute), newQueue);
    }

    addToQueue.show = (target) => {
      return addToQueue.remove(target, '.lg-hide');
    }

    addToQueue.hide= (target) => {
      return addToQueue.add(target, '.lg-hide');
    }

  let api = {};
  api.add = (target, attribute) => addToQueue.add(target, attribute, true);
  api.remove = (target, attribute) => addToQueue.remove(target, attribute, true);
  api.toggle = (target, attribute) => addToQueue.toggle(target, attribute, true);
  api.show = target => addToQueue.remove(target, '.lg-hide', true);
  api.hide = target => addToQueue.add(target, '.lg-hide', true);

  window.letsGo = api;
}))(window, document);
