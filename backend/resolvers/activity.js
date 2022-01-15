const Activity = {
  progress(parent, args, { db }, info) {
    return Promise.all(parent.progress.map((pId) => db.Progress.findById(pId)));
  },
  todo(parent, args, { db }, info) {
    return Promise.all(parent.todo.map((todoId) => db.Todo.findById(todoId)));
  },
};

export default Activity;
