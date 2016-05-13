"use strict";

var checkIfClass = function() {
    function hasClass(element, class) {
        return (' ' + element.className + ' ').indexOf(' ' + class + ' ') > -1;
    }
}

var hideElement = function(element, hideDelay) {
    if (hideDelay) {
        .classList.add('frow-hiding');
        setTimeout(function(){
                element.style.display = 'none';
                .classList.remove('frow-hiding');
            }, hideDelay);
    } else {
        element.style.display = 'none';
    }
}

var frowChange = function(id, setting, hideDelay) {
    if (id) {
        console.log(typeof id);
        if (typeof id === 'string') {
            var element = document.getElementById(id);
            if (setting === true) {
                element.style.display = 'none';
            } else if (setting === false) {
                element.style.display = 'block';
            } else if (setting === 'toggle') {
                if (element.style.display === 'none') {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            }
        } else {
            console.log('frowChange id is not a string');
        }
    } else {
        console.log('frowChange missing id');
    }
}
