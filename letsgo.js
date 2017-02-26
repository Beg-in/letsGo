/*!
 * letsGo
 * http://letsgojs.com/
 *
 * By: Cody Sherman <cody@beg.in> (codysherman.com)
 */

(function(window, document) {
    'use strict';

    let error = function() {
        window.console.error.apply(window.console, arguments);
    };

    let letsGoRunning = false;
    let letsGoQueue = [];

    let letsGo = function(target, command, attribute, noOrder) {
        let queueMatters = false;

        let nextInQueue = function(lastOne) {
            if (queueMatters && lastOne) {
                letsGoQueue.shift();
                if (letsGoQueue.length > 0) {
                    router(letsGoQueue[0][0], letsGoQueue[0][1], letsGoQueue[0][2]);
                } else {
                    letsGoRunning = false;
                }
            }
        };

        let checkIfAttribute = function(element, attribute, attributeIsClass) {
            if (!attribute || attributeIsClass) {
                attribute = (attribute) ? attribute : 'letsGo-hide';
                return (' ' + element.className + ' ').indexOf(' ' + attribute + ' ') > -1;
            } else if (attribute.indexOf('=') > -1) {
                attribute = attribute.split('=');
                return (element.hasAttribute(attribute[0])) && (element.getAttribute(attribute[0]) === attribute[1]);
            } else {
                return (element.hasAttribute(attribute) && (element.getAttribute(attribute) === ''));
            }
        }

        let findAnimateTime = function(times) {
            if (times.indexOf(',') > -1) {
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

        let alterAttribute = function(element, styles, add, attribute, attributeIsClass, lastOne) {
            let command = (add) ? 'add' : 'remove';

            if (attributeIsClass) {
                let alterAttributeDone = function() {
                    element.removeEventListener('animationend', alterAttributeDone, false);
                    if (add) {
                        element.classList.add(attribute);
                    }
                    element.classList.remove(attribute + '-' + command);
                    element.classList.remove(attribute + '-' + command + '-active');
                    element.classList.remove('letsGo-animate');
                    nextInQueue(lastOne);
                };

                element.classList.add('letsGo-animate');
                element.classList.add(attribute + '-' + command);
                if (!add) {
                    element.classList.remove(attribute);
                }
                setTimeout(function() {
                    if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
                        element.classList.add(attribute + '-' + command + '-active');
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
                //     element.setAttribute(attribute[0], attribute[1]);
                // }
                if (add) {
                    if (attribute.indexOf('=') > -1) {
                         attribute = attribute.split('=');
                         element.setAttribute(attribute[0], attribute[1]);
                    } else {
                        element.setAttribute(attribute, '');
                    }
                } else {
                    if (attribute.indexOf('=') > -1) {
                         attribute = attribute.split('=');
                         element.removeAttribute(attribute[0]);
                    } else {
                        element.removeAttribute(attribute);
                    }
                }
                nextInQueue(lastOne);
            }
        };

        let router = function(target, command, attribute) {
            if (!target) {
                return error('letsGo: missing \'target\' parameter.');
            }
<<<<<<< HEAD
            if (!command) {
                return error('letsGo: missing \'command\' parameter.');
            }
            if (typeof target !== 'string') {
                return error('letsGo: \'target\' parameter is not a string type.');
            }
            if (command !== 'show' && command !== 'hide' && command !== 'add' && command !== 'remove' && command !== 'toggle') {
                return error('letsGo: \'command\' parameter is not the string \'show\', \'hide\', \'add\', \'remove\', or \'toggle\'.');
            }
            let targetType = null;
            let attributeIsClass = null;
            let lastOne = false;
            if (target.charAt(0) === '#') {
                targetType = 'id';
                target = target.substring(1);
                let element = document.getElementById(target);
                if (element === null) {
                    return error('letsGo: no element of ' + targetType + ' \'' + target + '\' found on page.');
=======
            setTimeout(function() {
                if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
                    element.classList.add(attribute + '-' + command + '-active');
                    var maxTransitionTime = findAnimateTime(styles.transitionDuration);
                    console.log(styles);
                    var maxAnimationTime = findAnimateTime(styles.animationDuration);
                    var maxTime = Math.ceil(Math.max(maxTransitionTime, maxAnimationTime)*1000);
                    setTimeout(alterAttributeDone, maxTime);
                    if (styles.animationDuration !== '0s') {
                        element.addEventListener('animationend', alterAttributeDone, false);
                    }
                } else {
                    alterAttributeDone();
>>>>>>> styles
                }
                let styles = window.getComputedStyle(element, null);
                if (command === 'show' || command === 'hide') {
                    if (attribute) {
                        return error('letsGo: using \'show\' or \'hide\' command can not have an \'attribute\' parameter.');
                    }
                    if (command === 'show') {
                        alterAttribute(element, styles, false, 'letsGo-hide', true, true);
                    } else if (command === 'hide') {
                        alterAttribute(element, styles, true, 'letsGo-hide', true, true);
                    }
                } else if ((command === 'add') || (command === 'remove')) {
                    if (!attribute) {
                        error('letsGo: using \'add\' or \'remove\' command must also have an \'attribute\' parameter.');
                    }
                    if (attribute.charAt(0) === '.') {
                        attributeIsClass = true;
                        attribute = attribute.substring(1);
                    } else if (attribute.charAt(0) === '#') {
                        attribute = 'id=' + attribute.substring(1);
                    }
                    if (command === 'add') {
                        alterAttribute(element, styles, true, attribute, attributeIsClass, true);
                    } else if (command === 'remove') {
                        alterAttribute(element, styles, false, attribute, attributeIsClass, true);
                    }
                } else if (command === 'toggle') {
                    if (attribute && attribute.charAt(0) === '.') {
                        attributeIsClass = true;
                        attribute = attribute.substring(1);
                    } else if (attribute && attribute.charAt(0) === '#') {
                        attribute = 'id=' + attribute.substring(1);
                    } else if (!attribute) {
                        attributeIsClass = true;
                        attribute = 'letsGo-hide';
                    }
                    if (checkIfAttribute(element, attribute, attributeIsClass)) {
                        alterAttribute(element, styles, false, attribute, attributeIsClass, true);
                    } else {
                        alterAttribute(element, styles, true, attribute, attributeIsClass, true);
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
                    return error('letsGo: no element of ' + targetType + ' \'' + target + '\' found on page.');
                }
                if ((command === 'show') || (command === 'hide')) {
                    if (attribute) {
                        return error('letsGo: using \'show\' or \'hide\' command can not have an \'attribute\' parameter.');
                    }
                    if (command === 'show') {
                        for (let i = 0; i < element.length; i++) {
                            let styles = window.getComputedStyle(element[i], null);
                            if (i === (element.length - 1) ) {
                                lastOne = true;
                            }
                            alterAttribute(element[i], styles, false, 'letsGo-hide', true, lastOne);
                        }
                    } else if (command === 'hide') {
                        for (let i = 0; i < element.length; i++) {
                            let styles = window.getComputedStyle(element[i], null);
                            if (i === (element.length - 1) ) {
                                lastOne = true;
                            }
                            alterAttribute(element[i], styles, true, 'letsGo-hide', true, lastOne);
                        }
                    }
                } else if ((command === 'add') || (command === 'remove')) {
                    if (!attribute) {
                        error('letsGo: using \'add\' or \'remove\' command must also have an \'attribute\' parameter.');
                    }
                    if (attribute.charAt(0) === '.') {
                        attributeIsClass = true;
                        attribute = attribute.substring(1);
                    } else if (attribute.charAt(0) === '#') {
                        attribute = 'id=' + attribute.substring(1);
                    }
                    if (command === 'add') {
                        for (let i = 0; i < element.length; i++) {
                            let styles = window.getComputedStyle(element[i], null);
                            if (i === (element.length - 1) ) {
                                lastOne = true;
                            }
                            alterAttribute(element[i], styles, true, attribute, attributeIsClass, lastOne);
                        }
                    } else if (command === 'remove') {
                        for (let i = 0; i < element.length; i++) {
                            let styles = window.getComputedStyle(element[i], null);
                            if (i === (element.length - 1) ) {
                                lastOne = true;
                            }
                            alterAttribute(element[i], styles, false, attribute, attributeIsClass, lastOne);
                        }
                    }
                } else if (command === 'toggle') {
                    if (attribute && attribute.charAt(0) === '.') {
                        attributeIsClass = true;
                        attribute = attribute.substring(1);
                    } else if (attribute && attribute.charAt(0) === '#') {
                        attribute = 'id=' + attribute.substring(1);
                    } else if (!attribute) {
                        attributeIsClass = true;
                        attribute = 'letsGo-hide';
                    }
                    for (let i = 0; i < element.length; i++) {
                        let styles = window.getComputedStyle(element[i], null);
                        if (i === (element.length - 1) ) {
                            lastOne = true;
                        }
                        if (checkIfAttribute(element[i], attribute, attributeIsClass)) {
                            alterAttribute(element[i], styles, false, attribute, attributeIsClass, lastOne);
                        } else {
                            alterAttribute(element[i], styles, true, attribute, attributeIsClass, lastOne);
                        }
                    }
                }
            }
        };

        let queueControl = function(target, command, attribute) {
            setTimeout(function () {
                letsGoQueue.push([target, command, attribute]);
                if (!letsGoRunning) {
                    letsGoRunning = true;
                    router(letsGoQueue[0][0], letsGoQueue[0][1], letsGoQueue[0][2]);
                }
            }, 0);
        };

        if (noOrder || attribute === true) {
            if (attribute === true) {
                router(target, command);
            }
            else {
               if (typeof noOrder === 'boolean') {
                   router(target, command, attribute);
               } else {
                   error('letsGo: \'noOrder\' parameter is not a boolean');
               }
           }
        } else {
            queueMatters = true;
            queueControl(target, command, attribute);
        }
    };

    let api = function(target, command, classname, queue) {
        // (target, command, classname, queue) -> sentence with no queue
        if(queue) {
            letsGo(target, command, classname, queue);
            return api;
        }
        // (target, command, classname) -> sentence
        if(classname) {
            letsGo(target, command, classname);
            return api;
        }
        // (target, classname) -> toggle class
        if(command) {
            letsGo(target, 'toggle' , command);
            return api;
        }
        // (target) -> toggle show/hide
        letsGo(target, 'toggle');
        return api;
    };
<<<<<<< HEAD
    api.while = function(target, command, classname) {
        // (target, command, classname) -> sentence
        if(classname) {
            letsGo(target, command, classname, true);
            return api;
        }
        // (target, classname) -> toggle class
        if(command) {
            letsGo(target, 'toggle' , command, true);
            return api;
=======

    if (queue || attribute === true) {
        queueMatters = true;
        if (attribute === true) {
            queueControl(target, command);
        } else {
            if (typeof queue === 'boolean') {
                queueControl(target, command, attribute);
            } else {
                console.log('letsGo: \'queue\' parameter is not a boolean');
            }
>>>>>>> styles
        }
        // (target) -> toggle show/hide
        letsGo(target, 'toggle', true);
        return api;
    };
    api.add = function(target, classname) {
        if(classname) {
            return api(target, 'add', classname);
        }
        return api(target, 'show');
    };
    api.remove = function(target, classname) {
        if(classname) {
            return api(target, 'remove', classname);
        }
        return api(target, 'hide');
    };
    api.then = api;
    window.letsGo = api;
})(window, document);
