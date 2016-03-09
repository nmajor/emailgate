export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.request.user);

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
