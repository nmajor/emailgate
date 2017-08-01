import io from 'socket.io-client';
import baseURL from '../shared/baseURL';

let socket = io(baseURL); // eslint-disable-line

export function refreshSocket() {
  socket.disconnect();
  socket = io(baseURL);
}

export default socket;
