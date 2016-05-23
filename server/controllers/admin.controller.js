import User from '../models/user';
import Compilation from '../models/compilation';
import Task from '../models/task';

export function getUsers(req, res) {
  User.find({})
  .then((users) => {
    res.json(users);
  });
}

export function getCompilations(req, res) {
  Compilation.find({})
  .then((compilations) => {
    res.json(compilations);
  });
}

export function getWorkerTasks(req, res) {
  Task.find({})
  .then((tasks) => {
    res.json(tasks);
  });
}
