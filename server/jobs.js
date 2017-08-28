import Compilation from './models/compilation';

export function test() {
  console.log('Running the test job!');
}

export function activitySummary() {
  const day = new Date();
  day.setDate(day.getDate() - 1);

  const start = new Date(day.getTime());
  start.setHours(0, 0, 0, 0);

  const end = new Date(day.getTime());
  end.setHours(23, 59, 59, 999);
  Compilation.count({ createdAt: { $gte: start, $lt: end } })
  .then((count) => {
    console.log('blah hey', count);
  });
  console.log('Running activity summary job!');
}
