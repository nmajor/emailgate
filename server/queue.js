require('dotenv').config();
import kue from 'kue';

const queue = kue.createQueue({
  redis: process.env.REDIS_URL,
});

kue.app.listen(7890);

export default queue;
