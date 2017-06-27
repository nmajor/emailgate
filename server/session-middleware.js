import session from 'express-session';
import ConnectMongo from './mongo';
import mongoose from './mongoose';

const sessionSecret = process.env.SESSION_SECRET || 'supercat';
// Define session middleware
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: false,
  store: new ConnectMongo({
    url: process.env.MONGO_URL,
    mongoose_connection: mongoose.connections[0],
  }),
});

export default sessionMiddleware;
