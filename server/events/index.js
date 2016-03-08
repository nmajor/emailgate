export default (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      // console.log('a user disconnected');
    });

    socket.on('error', () => {
      // console.log('Socket errror! '+ err);
    });
  });
};
