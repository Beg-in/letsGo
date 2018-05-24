import { ADD, REMOVE } from './constants.js';
import error from './error.js';

export default function (command, target, attribute) {
  if (!target) {
    throw error('missing \'target\' parameter');
  }
  if (typeof target !== 'string') {
    throw error('\'target\' parameter is not a string type');
  }
  if ((command === ADD || command === REMOVE) && !attribute) {
    throw error('using \'add\' or \'remove\' commands must also have an \'attribute\' parameter');
  }
};

