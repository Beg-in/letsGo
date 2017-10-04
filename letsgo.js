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

    let letsGo = function(target, command, modifier, newQueue) {
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

        let checkIfAttribute = function(element, modifier, attributeIsClass) {
            if (!modifier || attributeIsClass) {
                modifier = (modifier) ? modifier : 'letsGo-hide';
                return (' ' + element.className + ' ').indexOf(' ' + modifier + ' ') > -1;
            } else if (modifier.indexOf('=') > -1) {
                modifier = modifier.split('=');
                return (element.hasAttribute(modifier[0])) && (element.getAttribute(modifier[0]) === modifier[1]);
            } else {
                return (element.hasAttribute(modifier) && (element.getAttribute(modifier) === ''));
            }
        };

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

        let alterModifier = function(element, styles, add, modifier, attributeIsClass, lastOne) {
            let command = (add) ? 'add' : 'remove';

            if (attributeIsClass) {
                let alterAttributeDone = function() {
                    element.removeEventListener('animationend', alterAttributeDone, false);
                    if (add) {
                        element.classList.add(modifier);
                    }
                    element.classList.remove(modifier + '-' + command);
                    element.classList.remove(modifier + '-' + command + '-active');
                    element.classList.remove('letsGo-animate');
                    nextInQueue(lastOne);
                };

                element.classList.add('letsGo-animate');
                element.classList.add(modifier + '-' + command);
                if (!add) {
                    element.classList.remove(modifier);
                }
                setTimeout(function() {
                    if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
                        element.classList.add(modifier + '-' + command + '-active');
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
                //     element.setAttribute(modifier[0], modifier[1]);
                // }
                if (add) {
                    if (modifier.indexOf('=') > -1) {
                         modifier = modifier.split('=');
                         element.setAttribute(modifier[0], modifier[1]);
                    } else {
                        element.setAttribute(modifier, '');
                    }
                } else {
                    if (modifier.indexOf('=') > -1) {
                         modifier = modifier.split('=');
                         element.removeAttribute(modifier[0]);
                    } else {
                        element.removeAttribute(modifier);
                    }
                }
                nextInQueue(lastOne);
            }
        };

        let router = function(target, command, modifier) {
            if (!target) {
                return error('letsGo: missing \'target\' parameter.');
            }
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
                }
                let styles = window.getComputedStyle(element, null);
                if (command === 'show' || command === 'hide') {
                    if (modifier) {
                        return error('letsGo: using \'show\' or \'hide\' command can not have an \'modifier\' parameter.');
                    }
                    if (command === 'show') {
                        alterModifier(element, styles, false, 'letsGo-hide', true, true);
                    } else if (command === 'hide') {
                        alterModifier(element, styles, true, 'letsGo-hide', true, true);
                    }
                } else if ((command === 'add') || (command === 'remove')) {
                    if (!modifier) {
                        error('letsGo: using \'add\' or \'remove\' command must also have an \'modifier\' parameter.');
                    }
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
                    if (modifier && modifier.charAt(0) === '.') {
                        attributeIsClass = true;
                        modifier = modifier.substring(1);
                    } else if (modifier && modifier.charAt(0) === '#') {
                        modifier = 'id=' + modifier.substring(1);
                    } else if (!modifier) {
                        attributeIsClass = true;
                        modifier = 'letsGo-hide';
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
                    return error('letsGo: no element of ' + targetType + ' \'' + target + '\' found on page.');
                }
                if ((command === 'show') || (command === 'hide')) {
                    if (modifier) {
                        return error('letsGo: using \'show\' or \'hide\' command can not have an \'modifier\' parameter.');
                    }
                    if (command === 'show') {
                        for (let i = 0; i < element.length; i++) {
                            let styles = window.getComputedStyle(element[i], null);
                            if (i === (element.length - 1) ) {
                                lastOne = true;
                            }
                            alterModifier(element[i], styles, false, 'letsGo-hide', true, lastOne);
                        }
                    } else if (command === 'hide') {
                        for (let i = 0; i < element.length; i++) {
                            let styles = window.getComputedStyle(element[i], null);
                            if (i === (element.length - 1) ) {
                                lastOne = true;
                            }
                            alterModifier(element[i], styles, true, 'letsGo-hide', true, lastOne);
                        }
                    }
                } else if ((command === 'add') || (command === 'remove')) {
                    if (!modifier) {
                        error('letsGo: using \'add\' or \'remove\' command must also have an \'modifier\' parameter.');
                    }
                    if (modifier.charAt(0) === '.') {
                        attributeIsClass = true;
                        modifier = modifier.substring(1);
                    } else if (modifier.charAt(0) === '#') {
                        modifier = 'id=' + modifier.substring(1);
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
                    if (modifier && modifier.charAt(0) === '.') {
                        attributeIsClass = true;
                        modifier = modifier.substring(1);
                    } else if (modifier && modifier.charAt(0) === '#') {
                        modifier = 'id=' + modifier.substring(1);
                    } else if (!modifier) {
                        attributeIsClass = true;
                        modifier = 'letsGo-hide';
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

        let queueControl = function(target, command, modifier) {
            setTimeout(function () {
                letsGoQueue.push([target, command, modifier]);
                if (!letsGoRunning) {
                    letsGoRunning = true;
                    router(letsGoQueue[0][0], letsGoQueue[0][1], letsGoQueue[0][2]);
                }
            }, 0);
        };

        if (!newQueue || modifier === true) {
            if (modifier === true) {
                router(target, command);
            }
            else {
               router(target, command, modifier);
           }
        } else {
            queueMatters = true;
            queueControl(target, command, modifier);
        }
    };

    let addToQueue = function(target, command, modifier, newQueue) {
        console.log(newQueue);
        // (target, command, modifier) -> sentence
        if(modifier) {
            letsGo(target, command, modifier, newQueue);
            return addToQueue;
        }
        // (target) -> toggle show/hide
        letsGo(target, 'toggle', null, newQueue);
        return addToQueue;
    };
    addToQueue.add = function(target, modifier, newQueue) {
        if(modifier) {
            return addToQueue(target, 'add', modifier, newQueue);
        } else {
            error('letsGo: second argument \'modifier\' is required'); 
        }
    };
    addToQueue.remove = function(target, modifier, newQueue) {
        if(modifier) {
            return addToQueue(target, 'remove', modifier, newQueue);
        } else {
            error('letsGo: second argument \'modifier\' is required'); 
        }
    };
    addToQueue.show = function(target) {
        return addToQueue.remove(target, '.letsGo-hide');
    };
    addToQueue.hide = function(target) {
        return addToQueue.add(target, '.letsGo-hide');
    };
    addToQueue.toggle = function(target, modifier, newQueue) {
        return addToQueue(target, 'toggle', modifier, newQueue);
    };
    
    let api = {};
    api.add = function(target, modifier) {
        return addToQueue.add(target, modifier, true);
    };
    api.remove = function(target, modifier) {
        return addToQueue.remove(target, modifier, true);
    };
    api.show = function(target) {
        return addToQueue.remove(target, '.letsGo-hide', true);
    };
    api.hide = function(target) {
        return addToQueue.add(target, '.letsGo-hide', true);
    };
    api.toggle = function(target, modifier) {
        return addToQueue(target, 'toggle', modifier, true);
    };
    
    window.letsgo = api;
})(window, document);