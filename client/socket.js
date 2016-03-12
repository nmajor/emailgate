import io from 'socket.io-client';
import * as Actions from '../shared/redux/actions';
import store from './store';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';
let socket;

if (typeof window !== 'undefined') {
  socket = io(baseURL);

  socket.on('UPDATE_ACCOUNT', (data) => {
    store.dispatch(Actions.socketUpdateAccount(data));
  });
}

export default socket;
