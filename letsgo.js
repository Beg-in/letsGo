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

    let letsGo = function(target, command, modifier, noOrder) {
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
                    console.log('mod', modifier);
                    if (modifier && modifier.charAt(0) === '.') {
                        attributeIsClass = true;
                        modifier = modifier.substring(1);
                    } else if (modifier && modifier.charAt(0) === '#') {
                        modifier = 'id=' + modifier.substring(1);
                    } else if (!modifier) {
                        console.log('ran');
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

        if (noOrder || modifier === true) {
            if (modifier === true) {
                router(target, command);
            }
            else {
               if (typeof noOrder === 'boolean') {
                   router(target, command, modifier);
               } else {
                   error('letsGo: \'noOrder\' parameter is not a boolean');
               }
           }
        } else {
            queueMatters = true;
            queueControl(target, command, modifier);
        }
    };

    let api = function(target, command, modifier, queue) {
        // (target, command, modifier, queue) -> sentence with no queue
        if(queue) {
            letsGo(target, command, modifier, queue);
            return api;
        }
        // (target, command, modifier) -> sentence
        if(modifier) {
            letsGo(target, command, modifier);
            return api;
        }
        // (target, modifier) -> toggle class
        if(command) {
            letsGo(target, command, modifier);
            return api;
        }
        // (target) -> toggle show/hide
        letsGo(target, 'toggle');
        return api;
    };
    api.while = function(target, command, modifier) {
        // (target, command, modifier) -> sentence
        if(modifier) {
            letsGo(target, command, modifier, true);
            return api;
        }
        // (target, modifier) -> toggle class
        if(command) {
            letsGo(target, 'toggle' , command, true);
            return api;
        }
        // (target) -> toggle show/hide
        letsGo(target, 'toggle', true);
        return api;
    };
    api.add = function(target, modifier, queue) {
        if(modifier) {
            return api(target, 'add', modifier, queue);
        } else {
            error('letsGo: second argument \'modifier\' is required'); 
        }
    };
    api.remove = function(target, modifier, queue) {
        if(modifier) {
            return api(target, 'remove', modifier, queue);
        } else {
            error('letsGo: second argument \'modifier\' is required'); 
        }
    };
    api.show = function(target, queue) {
        if(!queue || typeof(queue) === 'boolean') {
            api.remove(target, '.letsGo-hide', queue);
        } else {
            error('letsGo: second argument should be \'queue\' of type boolean');
        }
    };
    api.hide = function(target, queue) {
        if(!queue || typeof(queue) === 'boolean') {
            api.add(target, '.letsGo-hide', queue);
        } else {
            error('letsGo: second argument should be \'queue\' of type boolean');
        }
    };
    api.toggle = function(target, modifier, queue) {
        console.log('modifier', modifier);
        return api(target, 'toggle', modifier, queue);
    }
    api.then = api;
    window.letsgo = api;
})(window, document);