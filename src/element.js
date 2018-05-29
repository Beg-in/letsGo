const NUM_REGEX = /[^\d\.]/g;

export function fromTime(time) {
  return +time.replace(NUM_REGEX, '');
};

export function findAnimateTime(times) {
  if (times.includes(',')) {
    return times.split(',').reduce((out, time) => {
      return Math.max(fromTime(time), out);
    }, 0);
  }
  return fromTime(times);
};

export function determineToggle(element, attribute) {
  if (attribute.charAt(0) === '.') {
    return element.className.includes(attribute.substring(1));
  } else if (attribute.includes('=')) {
    attribute = attribute.split('=');
    return element.hasAttribute(attribute[0]) && (element.getAttribute(attribute[0]) === attribute[1]);
  } else {
    return element.hasAttribute(attribute);
  }
};

export function animationEnd(element) {
  return new Promise(resolve => {
    let listener = () => {
      resolve(listener);
    };
    element.addEventListener('animationend', listener, false);
  }).then(listener => element.removeEventListener('animationend', listener, false));
};
