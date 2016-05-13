'use strict';

var checkIfClass = function(element) {
    return (' ' + element.className + ' ').indexOf(' frow-hidden ') > -1;
};

var hideElement = function(element, hideDelay) {
    console.log(element);
    if (hideDelay) {
        element.classList.add('frow-hiding');
        setTimeout(function(){
                element.classList.add('frow-hidden');
                element.classList.remove('frow-hiding');
            }, hideDelay);
    } else {
        element.classList.add('frow-hidden');
    }
};

var frowShow = function(id, setting, hideDelay) {
    if (id) {
        if (typeof id === 'string') {
            var element = document.getElementById(id);
            if (setting === true) {
                element.classList.remove('frow-hidden');
            } else if (setting === false) {
                hideElement(element, hideDelay);
            } else if (setting === 'toggle') {
                if (checkIfClass(element)) {
                    element.classList.remove('frow-hidden');
                } else {
                    hideElement(element, hideDelay);
                }
            }
        } else {
            console.log('frowChange id is not a string');
        }
    } else {
        console.log('frowChange missing id');
    }
};
