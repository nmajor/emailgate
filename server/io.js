// Socket.io
import socketEvents from './events/index';
import sessionMiddleware from './session-middleware';
import socketIo from 'socket.io';

const io = socketIo();
socketEvents(io);
io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res, next); });

export default io;
