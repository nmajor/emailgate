require('dotenv').config();
import kue from 'kue';

const queue = kue.createQueue({
  redis: process.env.REDIS_URL,
  disableSearch: false,
});

queue.watchStuckJobs(1000000);

kue.app.listen(7890);

export { kue };
export default queue;
