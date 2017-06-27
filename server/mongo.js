import session from 'express-session';
import connectMongo from 'connect-mongo';
const ConnectMongo = connectMongo(session);

export default ConnectMongo;
