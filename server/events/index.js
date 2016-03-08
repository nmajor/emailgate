// import passport from 'passport';
import User from '../models/user';

function setSessionUser(socket, data) {
  socket.request.session.user = data; // eslint-disable-line no-param-reassign
  socket.request.session.save();
}

function emitUserResults(socket, type, data) {
  const results = data;
  results.type = type;

  socket.emit(type, results);
}

function emitBaseError(socket, type, message) {
  emitUserResults(socket, type, {
    type,
    errors: {
      base: [message],
    },
  });
}

function emitPasswordError(socket, type, message) {
  emitUserResults(socket, type, {
    type,
    errors: {
      password: [message],
    },
  });
}

function bumpAuthenticatedTil(socket) {
  if (!socket.request.session.user || !socket.request.session.user.authenticatedTil) { return; }

  let authenticatedTil = new Date(); // eslint-disable-line prefer-const
  authenticatedTil.setDate(authenticatedTil.getDate() + 30);

  socket.request.session.user.authenticatedTil = authenticatedTil; // eslint-disable-line no-param-reassign
  socket.request.session.save();
}

function setSessionUserAndEmit(socket, type, user) {
  let authenticatedTil = new Date(); // eslint-disable-line prefer-const
  authenticatedTil.setDate(authenticatedTil.getDate() + 30);

  const email = user.email;
  const authenticated = Date.now() <= authenticatedTil;
  const authenticatedAt = Date.now();

  const userData = {
    name: user.name,
    email,
    authenticated,
    authenticatedAt,
    authenticatedTil,
  };

  setSessionUser(socket, userData);
  emitUserResults(socket, type, userData);
}

function authenticateUser(socket, authType, user, password) {
  const type = `${authType}_USER_RESULTS`;

  user.authenticate(password, (authErr, authUser, passwordErr) => {
    if (authErr) {
      return emitBaseError(socket, type, authErr.message);
    }

    if (passwordErr) {
      return emitPasswordError(socket, type, passwordErr.message);
    }

    setSessionUserAndEmit(socket, type, authUser);
  });
}

export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.request.session);
    if (socket.request.session.user) {
      bumpAuthenticatedTil();

      const type = 'SET_USER';
      const sessionUser = socket.request.session.user;

      sessionUser.type = type;
      sessionUser.authenticated = Date.now() <= sessionUser.authenticatedTil;

      socket.emit('SET_USER', sessionUser);
    }

    socket.on('REGISTER_USER', (userData) => {
      console.log('recieved REGISTER_USER');
      const userAttr = {
        name: userData.name,
        email: userData.email,
      };

      User.register(new User(userAttr), userData.password, (err, user) => {
        if (err) {
          return emitBaseError(socket, 'REGISTER_USER_RESULTS', err.message);
        }

        return authenticateUser(socket, 'REGISTER', user, userData.password);
      });
    });

    socket.on('LOGIN_USER', (userData) => {
      console.log('recieved LOGIN_USER');
      User.findOne({ email: userData.email })
      .then((user) => {
        if (!user) {
          return socket.emit('LOGIN_USER_RESULTS', {
            type: 'LOGIN_USER_RESULTS',
            errors: {
              base: ['User not found.'],
            },
          });
        }

        authenticateUser(socket, 'LOGIN', user, userData.password);
      })
      .catch((err) => {
        return socket.emit('LOGIN_USER_RESULTS', {
          type: 'LOGIN_USER_RESULTS',
          errors: {
            base: [err.message],
          },
        });
      });
    });

    socket.on('LOGOUT_USER', () => {
      console.log('recieved LOGOUT_USER');
      delete socket.request.session.user; // eslint-disable-line no-param-reassign

      return socket.emit('LOGOUT_USER_RESULTS', {
        type: 'LOGOUT_USER_RESULTS',
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
