export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('CREATE_ACCOUNT', () => {
      console.log('session from socket');
      console.log(socket.request.session);
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
