import { ADD, REMOVE } from './constants.js';
import * as error from './error.js';

export default function (command, target, attribute) {
  if (!target) {
    throw error.raise('missing \'target\' parameter');
  }
  if (typeof target !== 'string') {
    throw error.raise('\'target\' parameter is not a string type');
  }
  if ((command === ADD || command === REMOVE) && !attribute) {
    throw error.raise('using \'add\' or \'remove\' commands must also have an \'attribute\' parameter');
  }
};
