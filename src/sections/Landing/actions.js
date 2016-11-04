'use strict';
import keys from './keys';

export const updateMaterialsLibrary = function(materials) {
  return {
    type: keys.UPDATE_MATERIALS,
    materials
  }
};
