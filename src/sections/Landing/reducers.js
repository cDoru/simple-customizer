'use strict';
import keys from './keys';

let a = {};
export const materials = function(state = a, action) {
  switch (action.type) {
    case keys.UPDATE_MATERIALS:
      return action.materials;
    default:
      return state
  }
};

export const angle = function(state = 'deck', action) {
  switch (action.type) {
    case keys.UPDATE_ANGLE:
      return action.angle
    default:
      return state
  }
}

