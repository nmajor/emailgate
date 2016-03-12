import Account from '../models/account';
import User from '../models/user';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('CHECK_ACCOUNT_CONNECTION', (data) => {
      console.log('CHECK_ACCOUNT_CONNECTION');

      User.findOne({ email: socket.request.session.passport.user })
      .then((user) => {
        return Account.findOne({ _user: user._id, _id: data._id });
      })
      .then((account) => {
        return account.checkConnection();
      })
      .then((account) => {
        return account.save();
      })
      .then((account) => {
        socket.emit('UPDATE_ACCOUNT', account);
      });
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
