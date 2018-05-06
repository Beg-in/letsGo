/* letsGo v0.2.3 | https://letsgojs.com */
(function (window, document) {
  var error = function error() {
    var _window$console;

    (_window$console = window.console).error.apply(_window$console, arguments);
  };

  var masterQueue = {};
  var masterId = 0;

  var letsGo = function letsGo(target, command, attribute, newQueue) {
    var activeId = null;

    var nextInQueue = function nextInQueue(lastOne) {
      if (lastOne) {
        masterQueue[activeId].queue.shift();
        if (masterQueue[activeId].queue.length > 0) {
          router();
        } else {
          masterQueue[activeId].running = false;
        }
      }
    };

    var checkIfAlreadyAttribute = function checkIfAlreadyAttribute(element, attribute, attributeIsClass) {
      if (attributeIsClass) {
        attribute = attribute ? attribute : 'lg-hide';
        return (' ' + element.className + ' ').includes(' ' + attribute + ' ');
      } else if (attribute.includes('=')) {
        attribute = attribute.split('=');
        return element.hasAttribute(attribute[0]) && element.getAttribute(attribute[0]) === attribute[1];
      } else {
        return element.hasAttribute(attribute) && element.getAttribute(attribute) === '';
      }
    };

    var findAnimateTime = function findAnimateTime(times) {
      if (times.includes(',')) {
        times = times.split(',');
        for (var i = 0; i < times.length; i++) {
          times[i] = Number(times[i].slice(0, -1));
        }
        times = Math.max.apply(null, times);
      } else {
        times = Number(times.slice(0, -1));
      }
      return times;
    };

    var alterModifier = function alterModifier(element, styles, add, attribute, attributeIsClass, lastOne) {
      var command = add ? 'add' : 'remove';

      if (attributeIsClass) {
        var alterAttributeDone = function alterAttributeDone() {
          element.removeEventListener('animationend', alterAttributeDone, false);
          if (add) {
            element.classList.add(attribute);
          }
          element.classList.remove(attribute + '-' + command);
          element.classList.remove(attribute + '-' + command + '-active');
          element.classList.remove('lg-animate');
          nextInQueue(lastOne);
        };

        element.classList.add('lg-animate');
        element.classList.add(attribute + '-' + command);
        if (!add) {
          element.classList.remove(attribute);
        }
        setTimeout(function () {
          if (styles.transitionDuration !== '0s' || styles.animationDuration !== '0s') {
            element.classList.add(attribute + '-' + command + '-active');
            var maxTransitionTime = findAnimateTime(styles.transitionDuration);
            var maxAnimationTime = findAnimateTime(styles.animationDuration) * styles.animationIterationCount;
            var maxTime = Math.ceil(Math.max(maxTransitionTime, maxAnimationTime) * 1000);
            setTimeout(alterAttributeDone, maxTime);
            if (styles.animationDuration !== '0s') {
              element.addEventListener('animationend', alterAttributeDone, false);
            }
          } else {
            alterAttributeDone();
          }
        }, 0);
      } else {
        if (add) {
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

    var router = function router() {
      var target = masterQueue[activeId].queue[0].target;
      var command = masterQueue[activeId].queue[0].command;
      var attribute = masterQueue[activeId].queue[0].attribute;
      var attributeIsClass = null;
      var lastOne = false;
      var element = [];
      element = document.querySelectorAll(target);
      if (element.length < 1) {
        return error('letsGo: no element of \'' + target + '\' found on page.');
      }
      if (attribute.charAt(0) === '.') {
        attributeIsClass = true;
        attribute = attribute.substring(1);
      }
      if (attribute.charAt(0) === '#') {
        attribute = 'id=' + attribute.substring(1);
      }
      for (var i = 0; i < element.length; i++) {
        var styles = window.getComputedStyle(element[i], null);
        if (i === element.length - 1) {
          lastOne = true;
        }
        var commandBoolean = command === 'add' || command === 'toggle' && !checkIfAlreadyAttribute(element[i], attribute, attributeIsClass) ? true : false;
        alterModifier(element[i], styles, commandBoolean, attribute, attributeIsClass, lastOne);
      }
    };

    if (newQueue) {
      activeId = ++masterId;
      masterQueue[activeId] = { running: false, queue: [] };
    }

    activeId = activeId || masterId;
    masterQueue[activeId].queue.push({ target: target, command: command, attribute: attribute });
    if (!masterQueue[activeId].running) {
      masterQueue[activeId].running = true;
      router();
    }
  };

  var validator = function validator(command, target, attribute) {
    if (!target) {
      error('letsGo: missing \'target\' parameter');
      return { validated: false };
    } else if (typeof target !== 'string') {
      error('letsGo: \'target\' parameter is not a string type');
      return { validated: false };
    } else if ((command === 'add' || command === 'remove') && !attribute) {
      error('letsGo: using \'add\' or \'remove\' commands must also have a \'attribute\' parameter');
      return { validated: false };
    } else {
      return { validated: true, command: command, target: target, attribute: attribute || '.lg-hide' };
    }
  };

  var addToQueue = function addToQueue(input, newQueue) {
    if (input.validated !== true) ;
    letsGo(input.target, input.command, input.attribute, newQueue);
    return addToQueue;
  };

  addToQueue.add = function (target, attribute, newQueue) {
    return addToQueue(validator('add', target, attribute), newQueue);
  };

  addToQueue.remove = function (target, attribute, newQueue) {
    return addToQueue(validator('remove', target, attribute), newQueue);
  };

  addToQueue.toggle = function (target, attribute, newQueue) {
    return addToQueue(validator('toggle', target, attribute), newQueue);
  };

  addToQueue.show = function (target) {
    return addToQueue.remove(target, '.lg-hide');
  };

  addToQueue.hide = function (target) {
    return addToQueue.add(target, '.lg-hide');
  };

  var api = {};
  api.add = function (target, attribute) {
    return addToQueue.add(target, attribute, true);
  };
  api.remove = function (target, attribute) {
    return addToQueue.remove(target, attribute, true);
  };
  api.toggle = function (target, attribute) {
    return addToQueue.toggle(target, attribute, true);
  };
  api.show = function (target) {
    return addToQueue.remove(target, '.lg-hide', true);
  };
  api.hide = function (target) {
    return addToQueue.add(target, '.lg-hide', true);
  };

  window.letsGo = api;
})(window, document);
