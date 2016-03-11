import Account from '../models/account';
import User from '../models/user';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('VALIDATE_ACCOUNT', (data) => {
      console.log('VALIDATE_ACCOUNT');

      User.findOne({ email: socket.request.session.passport.user })
      .then((user) => {
        return Account.findOne({ _user: user._id, _id: data._id });
      })
      .then((account) => {
        return account.validate();
      })
      .then((account) => {
        console.log('blahcheck');
        console.log(account);
        // console.log(account.save());
        return account.save();
      })
      .then((account) => {
        console.log('validated account');
        socket.emit('UPDATE_ACCOUNT_IN_ACCOUNTS', account);
      })
      .catch((err) => {
        console.log('an error happened');
        console.log(err);
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
