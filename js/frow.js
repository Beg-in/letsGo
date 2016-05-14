'use strict';

var checkIfClass = function(element) {
    return (' ' + element.className + ' ').indexOf(' frow-hide ') > -1;
};

var showElement = function(element, styles) {
    var showElementDone = function() {
        element.classList.remove('frow-hide-remove');
        element.classList.remove('frow-hide-remove-active');
        element.classList.remove('frow-animate');
    };

    element.classList.add('frow-animate');
    element.classList.add('frow-hide-remove');
    element.classList.remove('frow-hide');
    element.classList.add('frow-hide-remove-active');
    if ((styles.animationDuration !== '0s') || (styles.transitionDuration !== '0s')) {
        var maxAnimateTime = Math.ceil(Math.max(Number(styles.transitionDuration.slice(0, -1)), Number(styles.animationDuration.slice(0, -1)))*1000);
        setTimeout(showElementDone, maxAnimateTime);
    } else {
        showElementDone();
    }
};

var hideElement = function(element, styles) {
    var hideElementDone = function() {
        element.classList.add('frow-hide');
        element.classList.remove('frow-hide-add');
        element.classList.remove('frow-hide-add-active');
        element.classList.remove('frow-animate');
    };

    element.classList.add('frow-animate');
    element.classList.add('frow-hide-add');
    element.classList.add('frow-hide-add-active');
    if ((styles.animationDuration !== '0s') || (styles.transitionDuration !== '0s')) {
        var maxAnimateTime = Math.ceil(Math.max(Number(styles.transitionDuration.slice(0, -1)), Number(styles.animationDuration.slice(0, -1)))*1000);
        setTimeout(hideElementDone, maxAnimateTime);
    } else {
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
