import { configureStore } from '../shared/redux/configureStore';
let store;

if (typeof window !== 'undefined') {
  store = configureStore(window.__INITIAL_STATE__);
}

export default store;
