'use strict';
import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

import * as appReducers from '../sections/App/reducers';
import * as landingReducers from '../sections/Landing/reducers';

const reducer = combineReducers({
  ...appReducers,
  ...landingReducers,
  routing: routerReducer
});

export default createStore(reducer,
  process.env.NODE_ENV!=='production' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);