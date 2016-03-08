export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.request.user);

    socket.on('REGISTER_USER', (userData) => {
      console.log('recieved REGISTER_USER');
      console.log(userData);
    });

    socket.on('LOGIN_USER', (userData) => {
      console.log('recieved LOGIN_USER');
      console.log(userData);
    });

    socket.on('LOGOUT_USER', () => {
      console.log('recieved LOGOUT_USER');
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
