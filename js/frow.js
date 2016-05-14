'use strict';

var checkIfClass = function(element) {
    return (' ' + element.className + ' ').indexOf(' frow-hide ') > -1;
};

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

var showElement = function(element, styles) {
    var showElementDone = function() {
        element.removeEventListener('animationend', showElementDone, false);
        element.classList.remove('frow-hide-remove');
        element.classList.remove('frow-hide-remove-active');
        element.classList.remove('frow-animate');
    };

    element.classList.add('frow-animate');
    element.classList.add('frow-hide-remove');
    element.classList.remove('frow-hide');
    setTimeout(function() {
        element.classList.add('frow-hide-remove-active');
        if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
            var maxTransitionTime = findAnimateTime(styles.transitionDuration);
            var maxAnimationTime = findAnimateTime(styles.animationDuration);
            var maxTime = Math.ceil(Math.max(maxTransitionTime, maxAnimationTime)*1000);
            setTimeout(showElementDone, maxTime);
            if (styles.animationDuration !== '0s') {
                element.addEventListener('animationend', showElementDone, false);
            }
        } else {
            showElementDone();
        }
    }, 0);
};

var hideElement = function(element, styles) {
    var hideElementDone = function() {
        element.removeEventListener('animationend', hideElementDone, false);
        element.classList.add('frow-hide');
        element.classList.remove('frow-hide-add');
        element.classList.remove('frow-hide-add-active');
        element.classList.remove('frow-animate');
    };

    element.classList.add('frow-animate');
    element.classList.add('frow-hide-add');
    setTimeout(function() {
        element.classList.add('frow-hide-add-active');
        if ((styles.transitionDuration !== '0s') || (styles.animationDuration !== '0s')) {
            var maxTransitionTime = findAnimateTime(styles.transitionDuration);
            var maxAnimationTime = findAnimateTime(styles.animationDuration);
            var maxTime = Math.ceil(Math.max(maxTransitionTime, maxAnimationTime)*1000);
            setTimeout(hideElementDone, maxTime);
            if (styles.animationDuration !== '0s') {
                element.addEventListener('animationend', hideElementDone, false);
            }
        } else {
            hideElementDone();
        }
    }, 0);
};

var frowShow = function(id, setting) {
    if (id) {
        if (typeof id === 'string') {
            if (id.charAt(0) === '#') {
                id = id.substring(1);
                if (setting) {
                    if ((setting === 'show') || (setting === 'hide') || (setting === 'toggle')) {
                        var element = document.getElementById(id);
                        var styles = window.getComputedStyle(element, null);
                        if (element === null) {
                            console.log('No element of id \'#' + element + '\' found on page.');
                        } else if (setting === 'show') {
                            showElement(element, styles);
                        } else if (setting === 'hide') {
                            hideElement(element, styles);
                        } else if (setting === 'toggle') {
                            if (checkIfClass(element)) {
                                showElement(element, styles);
                            } else {
                                hideElement(element, styles);
                            }
                        }
                    } else {
                        console.log('frowShow \'setting\' parameter is not the string \'show\', \'hide\', or \'toggle\'.');
                    }
                } else {
                    console.log('frowShow missing \'setting\' parameter.');
                }
            } else if (id.charAt(0) === '.') {
                id = id.substring(1);
                if (setting) {
                    if ((setting === 'show') || (setting === 'hide') || (setting === 'toggle')) {
                        var element = document.getElementsByClassName(id);
                        if (element === null) {
                            console.log('No elements of class \'.' + element + '\' found on page.');
                        } else if (setting === 'show') {
                            for (var i = 0; i < element.length; i++) {
                                var styles = window.getComputedStyle(element[i], null);
                                showElement(element[i], styles);
                            }
                        } else if (setting === 'hide') {
                            console.log(element.length);
                            for (var i = 0; i < element.length; i++) {
                                var styles = window.getComputedStyle(element[i], null);
                                hideElement(element[i], styles);
                            }
                        }
                    } else {
                        console.log('frowShow \'setting\' parameter is not the string \'show\', \'hide\', or \'toggle\'.');
                    }
                } else {
                    console.log('frowShow missing \'setting\' parameter.');
                }
            } else {
                console.log('frowShow \'id\' parameter does not begin with either \'#\' or \'.\'')
            }
        } else {
            console.log('frowShow \'id\' parameter is not a string type.');
        }
    } else {
        console.log('frowShow missing \'id\' parameter.');
    }
};
