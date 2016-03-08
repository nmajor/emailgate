export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('REGISTER_USER', (userData) => {
      console.log('blah REGISTER_USER');
      console.log(userData);
    });

    socket.on('LOGIN_USER', (userData) => {
      console.log('blah LOGIN_USER');
      console.log(userData);
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      // console.log('Socket errror! '+ err);
    });
  });
};
