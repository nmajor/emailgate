import Task from '../models/task';

// Private functions

// Public functions

export function enqueue(kind, props) {
  // TODO: Prevent duplicate tasks. Maybe increse priority if inserted more than once.

  const task = new Task({
    kind,
    props,
  });
  return task.save();
}
