'use strict';

var checkIfAttribute = function(element, attribute, attributeIsClass) {
    if (!attribute || attributeIsClass) {
        attribute = (attribute) ? attribute : 'frow-hide';
        console.log((' ' + element.className + ' ').indexOf(' ' + attribute + ' ') > -1);
        return (' ' + element.className + ' ').indexOf(' ' + attribute + ' ') > -1;
    } else if (attribute.indexOf('=') > -1) {
        attribute = attribute.split('=');
        return (element.hasAttribute(attribute[0])) && (element.getAttribute(attribute[0]) === attribute[1]);
    } else {
        return (element.hasAttribute(attribute) && (element.getAttribute(attribute) === ''));
    }
}

var findAnimateTime = function(times) {
    if (times.indexOf(',') > -1) {
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

var alterAttribute = function(element, styles, add, attribute, attributeIsClass) {
    var command = (add) ? 'add' : 'remove';

    if (!attribute || attributeIsClass) {
        attribute = (attribute) ? attribute : 'frow-hide';
        var alterAttributeDone = function() {
            element.removeEventListener('animationend', alterAttributeDone, false);
            if (add) {
                element.classList.add(attribute);
            }
            element.classList.remove(attribute + '-' + command);
            element.classList.remove(attribute + '-' + command + '-active');
            element.classList.remove('frow-animate');
        };

        element.classList.add('frow-animate');
        element.classList.add(attribute + '-' + command);
        if (!add) {
            element.classList.remove(attribute);
        }
        setTimeout(function() {
            if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
                element.classList.add(attribute + '-' + command + '-active');
                var maxTransitionTime = findAnimateTime(styles.transitionDuration);
                var maxAnimationTime = findAnimateTime(styles.animationDuration);
                var maxTime = Math.ceil(Math.max(maxTransitionTime, maxAnimationTime)*1000);
                setTimeout(alterAttributeDone, maxTime);
                if (styles.animationDuration !== '0s') {
                    element.addEventListener('animationend', alterAttributeDone, false);
                }
            } else {
                alterAttributeDone();
            }
        }, 0);
    } else {
        // var setTheAttribute = function() {
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
    }
};

var frowShow = function(target, command, attribute) {
    if (target) {
        if (command) {
            if (typeof target === 'string') {
                var targetType = null;
                var attributeIsClass = null;
                if (target.charAt(0) === '#') {
                    targetType = 'id';
                    target = target.substring(1);
                    var element = document.getElementById(target);
                    if (element !== null) {
                        var styles = window.getComputedStyle(element, null);
                        if (command === 'show' || command === 'hide') {
                            if (!attribute) {
                                if (command === 'show') {
                                    alterAttribute(element, styles, false);
                                } else if (command === 'hide') {
                                    alterAttribute(element, styles, true);
                                }
                            } else {
                                console.log('frowShow: using \'show\' or \'hide\' command can not have an \'attribute\' parameter.');
                            }
                        } else if ((command === 'add') || (command === 'remove')) {
                            if (attribute) {
                                if (attribute.charAt(0) === '.') {
                                    attributeIsClass = true;
                                    attribute = attribute.substring(1);
                                }
                                if (command === 'add') {
                                    alterAttribute(element, styles, true, attribute, attributeIsClass);
                                } else if (command === 'remove') {
                                    alterAttribute(element, styles, false, attribute, attributeIsClass);
                                }
                            } else {
                                console.log('frowShow: using \'add\' or \'remove\' command must also have an \'attribute\' parameter.');
                            }
                        } else if (command === 'toggle') {
                            if (attribute && attribute.charAt(0) === '.') {
                                attributeIsClass = true;
                                attribute = attribute.substring(1);
                            }
                            if (checkIfAttribute(element, attribute, attributeIsClass)) {
                                alterAttribute(element, styles, false, attribute, attributeIsClass);
                            } else {
                                alterAttribute(element, styles, true, attribute, attributeIsClass);
                            }
                        } else {
                            console.log('frowShow: \'command\' parameter is not the string \'show\', \'hide\', \'add\', \'remove\', or \'toggle\'.');
                        }
                    } else {
                        console.log('frowShow: no element of ' + targetType + ' \'' + target + '\' found on page.');
                    }
                } else {
                    var element = [];
                    if (target.charAt(0) === '.') {
                        targetType = 'class';
                        target = target.substring(1);
                        element = document.getElementsByClassName(target);
                    } else {
                        targetType = 'tag';
                        element = document.getElementsByTagName(target);
                    }
                    if (element.length > 0) {
                        if ((command === 'show') || (command === 'hide')) {
                            if (!attribute) {
                                if (command === 'show') {
                                    for (var i = 0; i < element.length; i++) {
                                        var styles = window.getComputedStyle(element[i], null);
                                        alterAttribute(element[i], styles, false);
                                    }
                                } else if (command === 'hide') {
                                    for (var i = 0; i < element.length; i++) {
                                        var styles = window.getComputedStyle(element[i], null);
                                        alterAttribute(element[i], styles, true);
                                    }
                                }
                            } else {
                                console.log('frowShow: using \'show\' or \'hide\' command can not have an \'attribute\' parameter.');
                            }
                        } else if ((command === 'add') || (command === 'remove')) {
                            if (attribute) {
                                if (attribute.charAt(0) === '.') {
                                    attributeIsClass = true;
                                    attribute = attribute.substring(1);
                                }
                                if (command === 'add') {
                                    for (var i = 0; i < element.length; i++) {
                                        var styles = window.getComputedStyle(element[i], null);
                                        alterAttribute(element[i], styles, true, attribute, attributeIsClass);
                                    }
                                } else if (command === 'remove') {
                                    for (var i = 0; i < element.length; i++) {
                                        var styles = window.getComputedStyle(element[i], null);
                                        alterAttribute(element[i], styles, false, attribute, attributeIsClass);
                                    }
                                }
                            } else {
                                console.log('frowShow: using \'add\' or \'remove\' command must also have an \'attribute\' parameter.');
                            }
                        } else if (command === 'toggle') {
                            if (attribute && attribute.charAt(0) === '.') {
                                attributeIsClass = true;
                                attribute = attribute.substring(1);
                            }
                            for (var i = 0; i < element.length; i++) {
                                var styles = window.getComputedStyle(element[i], null);
                                if (checkIfAttribute(element[i], attribute, attributeIsClass)) {
                                    alterAttribute(element[i], styles, false, attribute, attributeIsClass);
                                } else {
                                    alterAttribute(element[i], styles, true, attribute, attributeIsClass);
                                }
                            }
                        } else {
                            console.log('frowShow: \'command\' parameter is not the string \'show\', \'hide\', \'add\', \'remove\', or \'toggle\'.');
                        }
                    } else {
                        console.log('frowShow: no element of ' + targetType + ' \'' + target + '\' found on page.');
                    }
                }
            } else {
                console.log('frowShow: \'target\' parameter is not a string type.');
            }
        } else {
            console.log('frowShow: missing \'command\' parameter.');
        }
    } else {
        console.log('frowShow: missing \'target\' parameter.');
    }
};
