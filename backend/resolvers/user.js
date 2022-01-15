const User = {
  todo(parent, args, { db }, info) {
    return Promise.all(parent.todo.map((todoId) => db.Todo.findById(todoId)));
  },
  activity(parent, args, { db }, info) {
    return Promise.all(parent.activity.map((aId) => db.Activity.findById(aId)));
  },
};

export default User;
