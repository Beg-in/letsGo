/* letsGo v0.2.3 | https://letsgojs.com */
'use strict';

(function (window, document) {
  var error = function error() {
    var _window$console;

    (_window$console = window.console).error.apply(_window$console, arguments);
  };

  var masterQueue = {};
  var masterId = 0;

  var letsGo = function letsGo(target, command, modifier, newQueue) {
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

    var checkIfAttribute = function checkIfAttribute(element, modifier, attributeIsClass) {
      if (!modifier || attributeIsClass) {
        modifier = modifier ? modifier : 'lg-hide';
        return (' ' + element.className + ' ').includes(' ' + modifier + ' ');
      } else if (modifier.includes('=')) {
        modifier = modifier.split('=');
        return element.hasAttribute(modifier[0]) && element.getAttribute(modifier[0]) === modifier[1];
      } else {
        return element.hasAttribute(modifier) && element.getAttribute(modifier) === '';
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

    var alterModifier = function alterModifier(element, styles, add, modifier, attributeIsClass, lastOne) {
      var command = add ? 'add' : 'remove';

      if (attributeIsClass) {
        var alterAttributeDone = function alterAttributeDone() {
          element.removeEventListener('animationend', alterAttributeDone, false);
          if (add) {
            element.classList.add(modifier);
          }
          element.classList.remove(modifier + '-' + command);
          element.classList.remove(modifier + '-' + command + '-active');
          element.classList.remove('lg-animate');
          nextInQueue(lastOne);
        };

        element.classList.add('lg-animate');
        element.classList.add(modifier + '-' + command);
        if (!add) {
          element.classList.remove(modifier);
        }
        setTimeout(function () {
          if (styles.transitionDuration !== '0s' || styles.animationDuration !== '0s') {
            element.classList.add(modifier + '-' + command + '-active');
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

    var router = function router() {
      var target = masterQueue[activeId].queue[0].target;
      var command = masterQueue[activeId].queue[0].command;
      var modifier = masterQueue[activeId].queue[0].modifier;
      var targetType = null;
      var attributeIsClass = null;
      var lastOne = false;
      if (target.charAt(0) === '#') {
        targetType = 'id';
        target = target.substring(1);
        var element = document.getElementById(target);
        if (element === null) {
          return error('letsGo: no element of ' + targetType + ' \'' + target + '\' found on page.');
        }
        var styles = window.getComputedStyle(element, null);
        if (command === 'add' || command === 'remove') {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = 'id=' + modifier.substring(1);
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
            modifier = 'id=' + modifier.substring(1);
          }
          if (checkIfAttribute(element, modifier, attributeIsClass)) {
            alterModifier(element, styles, false, modifier, attributeIsClass, true);
          } else {
            alterModifier(element, styles, true, modifier, attributeIsClass, true);
          }
        }
      } else {
        var _element = [];
        if (target.charAt(0) === '.') {
          targetType = 'class';
          target = target.substring(1);
          _element = document.getElementsByClassName(target);
        } else {
          targetType = 'tag';
          _element = document.getElementsByTagName(target);
        }
        if (_element.length < 1) {
          return error('letsGo: no element of ' + targetType + ' \'' + target + '\' found on page.');
        }
        if (command === 'add' || command === 'remove') {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = 'id=' + modifier.substring(1);
          }
          if (command === 'add') {
            for (var i = 0; i < _element.length; i++) {
              var _styles = window.getComputedStyle(_element[i], null);
              if (i === _element.length - 1) {
                lastOne = true;
              }
              alterModifier(_element[i], _styles, true, modifier, attributeIsClass, lastOne);
            }
          } else if (command === 'remove') {
            for (var _i = 0; _i < _element.length; _i++) {
              var _styles2 = window.getComputedStyle(_element[_i], null);
              if (_i === _element.length - 1) {
                lastOne = true;
              }
              alterModifier(_element[_i], _styles2, false, modifier, attributeIsClass, lastOne);
            }
          }
        } else if (command === 'toggle') {
          if (modifier.charAt(0) === '.') {
            attributeIsClass = true;
            modifier = modifier.substring(1);
          } else if (modifier.charAt(0) === '#') {
            modifier = 'id=' + modifier.substring(1);
          }
          for (var _i2 = 0; _i2 < _element.length; _i2++) {
            var _styles3 = window.getComputedStyle(_element[_i2], null);
            if (_i2 === _element.length - 1) {
              lastOne = true;
            }
            if (checkIfAttribute(_element[_i2], modifier, attributeIsClass)) {
              alterModifier(_element[_i2], _styles3, false, modifier, attributeIsClass, lastOne);
            } else {
              alterModifier(_element[_i2], _styles3, true, modifier, attributeIsClass, lastOne);
            }
          }
        }
      }
    };

    if (newQueue) {
      activeId = ++masterId;
      masterQueue[activeId] = { running: false, queue: [] };
    }

    activeId = activeId || masterId;
    masterQueue[activeId].queue.push({ target: target, command: command, modifier: modifier });
    if (!masterQueue[activeId].running) {
      masterQueue[activeId].running = true;
      router();
    }
  };

  var validator = function validator(command, target, modifier) {
    if (!target) {
      error('letsGo: missing \'target\' parameter');
      return { validated: false };
    } else if (typeof target !== 'string') {
      error('letsGo: \'target\' parameter is not a string type');
      return { validated: false };
    } else if ((command === 'add' || command === 'remove') && !modifier) {
      error('letsGo: using \'add\' or \'remove\' commands must also have a \'modifier\' parameter');
      return { validated: false };
    } else {
      return { validated: true, command: command, target: target, modifier: modifier || '.lg-hide' };
    }
  };

  var addToQueue = function addToQueue(input, newQueue) {
    if (input.validated !== true) ;
    letsGo(input.target, input.command, input.modifier, newQueue);
    return addToQueue;
  };

  addToQueue.add = function (target, modifier, newQueue) {
    return addToQueue(validator('add', target, modifier), newQueue);
  };

  addToQueue.remove = function (target, modifier, newQueue) {
    return addToQueue(validator('remove', target, modifier), newQueue);
  };

  addToQueue.toggle = function (target, modifier, newQueue) {
    return addToQueue(validator('toggle', target, modifier), newQueue);
  };

  addToQueue.show = function (target) {
    return addToQueue.remove(target, '.lg-hide');
  };

  addToQueue.hide = function (target) {
    return addToQueue.add(target, '.lg-hide');
  };

  var api = {};
  api.add = function (target, modifier) {
    return addToQueue.add(target, modifier, true);
  };
  api.remove = function (target, modifier) {
    return addToQueue.remove(target, modifier, true);
  };
  api.toggle = function (target, modifier) {
    return addToQueue.toggle(target, modifier, true);
  };
  api.show = function (target) {
    return addToQueue.remove(target, '.lg-hide', true);
  };
  api.hide = function (target) {
    return addToQueue.add(target, '.lg-hide', true);
  };

  window.letsGo = api;
})(window, document);
