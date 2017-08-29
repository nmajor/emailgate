import io from 'socket.io-client';
import baseURL from '../shared/baseURL';

let socket = io(baseURL); // eslint-disable-line

export function refreshSocket(cb) {
  socket.disconnect();
  socket = io.connect(baseURL);

  if (cb) {
    socket.on('connect', () => {
      cb();
    });
  }
}

export default socket;
