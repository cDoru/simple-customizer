'use strict';
import keys from './keys';

export const updateMaterialsLibrary = function(materials) {
  return {
    type: keys.UPDATE_MATERIALS,
    materials
  }
};

export const updateAngle = function(angle) {
  return {
    type: keys.UPDATE_ANGLE,
    angle
  }
}
