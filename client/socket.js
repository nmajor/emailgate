import io from 'socket.io-client';
import baseURL from '../shared/baseURL';

export default io(baseURL);
