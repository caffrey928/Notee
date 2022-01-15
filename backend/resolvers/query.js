const bcrypt = require("bcrypt");

const Query = {
  async login(parent, { userName, password }, { db }, info) {
    let user = await db.User.findOne({ name: userName });
    if (!user) return false;
    const res = await bcrypt.compare(password, user.password);
    return res;
  },
  async user(parent, { name }, { db }, info) {
    let user = await db.User.findOne({ name: name });
    if (!user) throw new Error("User does not exist");
    return user;
  },
  // async userTodo(parent, { userName }, { db }, info) {
  //   let user = await db.User.findOne({ name: userName });
  //   if (!user) throw new Error("User does not exist");
  //   return user.todo;
  // },
  // async userActivity(parent, { userName }, { db }, info) {
  //   let user = await db.User.findOne({ name: userName });
  //   if (!user) throw new Error("User does not exist");
  //   return user.activity;
  // },
  activity(parent, { id }, { db }, info) {
    return db.Activity.findById(id);
  },
};

export default Query;
