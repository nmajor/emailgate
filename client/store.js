import { configureStore } from '../shared/redux/configureStore';
let store; // eslint-disable-line import/no-mutable-exports

if (typeof window !== 'undefined') {
  store = configureStore(window.__INITIAL_STATE__);
}

export default store;
