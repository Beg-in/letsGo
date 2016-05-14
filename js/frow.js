'use strict';

var checkIfClass = function(element) {
    return (' ' + element.className + ' ').indexOf(' frow-hidden ') > -1;
};

var showElement = function(element, styles) {
    var showElementDone = function() {
        element.removeEventListener('animationend', showElementDone, false);
        element.removeEventListener('transitionend', showElementDone, false);
        element.classList.remove('frow-showing');
        element.classList.remove('frow-animate');
    };

    var showElementStart = function() {
        element.addEventListener('animationend', showElementDone, false);
        element.addEventListener('transitionend', showElementDone, false);
    };

    element.classList.add('frow-animate');
    element.classList.add('frow-showing');
    element.classList.remove('frow-hidden');
    if ((styles.animationDuration !== '0s') || (styles.transitionDuration !== '0s')) {
        console.log('lets goooo');
        showElementStart();
    } else {
        console.log('no animation or transition');
        showElementDone();
    }
};

var hideElement = function(element, styles) {
    var hideElementDone = function() {
        element.removeEventListener('animationend', hideElementDone, false);
        element.removeEventListener('transitionend', hideElementDone, false);
        element.classList.add('frow-hidden');
        element.classList.remove('frow-hiding');
        element.classList.remove('frow-animate');
    };

    var hideElementStart = function() {
        element.addEventListener('animationend', hideElementDone, false);
        element.addEventListener('transitionend', hideElementDone, false);
    };

    element.classList.add('frow-animate');
    element.classList.add('frow-hiding');
    console.log(styles);
    if ((styles.animationDuration !== '0s') || (styles.transitionDuration !== '0s')) {
        console.log('lets goooo');
        hideElementStart();
        // element.addEventListener('animationstart', hideElementStart, false);
        // element.addEventListener('transitionstart', hideElementStart, false);
    } else {
        console.log('no animation or transition');
        hideElementDone();
    }
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
