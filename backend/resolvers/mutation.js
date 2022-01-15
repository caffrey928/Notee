const bcrypt = require("bcrypt");
const saltRounds = 10;

const Mutation = {
  async createUser(parent, { name, password }, { db }, info) {
    let user = await db.User.findOne({ name: name });
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    if (user) throw new Error("User exist");
    return db
      .User({ name: name, password: hashedPassword, todo: [], activity: [] })
      .save();
  },

  async createTodo(
    parent,
    { name, title, dueTime, activity, description, priority },
    { db },
    info
  ) {
    if (!name || !title || !dueTime || !priority)
      throw new Error("Missing props for CreateTodo");

    let user = await db.User.findOne({ name: name });

    if (!user) throw new Error("User does not exist");

    let newTodo = await new db.Todo({
      title: title,
      dueTime: dueTime,
      activity: activity,
      description: description,
      priority: priority,
    }).save();

    if (activity) {
      await user.activity.map(async (aId) => {
        let act = await db.Activity.findById(aId);
        if (act.title === activity) {
          await db.Activity.updateOne(
            { _id: aId },
            { $push: { todo: newTodo._id } }
          );
          if (act.users.length !== 1) {
            pubsub.publish(`${aId} content`, {
              activityContent: {
                mutation: "CREATED",
                data: await db.Activity.findById(aId),
              },
            });
          }
        }
      });
      return newTodo;
    }
    await db.User.updateOne({ name: name }, { $push: { todo: newTodo._id } });
    return newTodo;
  },

  async modifyTodo(
    parent,
    { id, name, title, dueTime, activity, description, priority },
    { db },
    info
  ) {
    let current = await db.Todo.findById(id);

    if (current.activity !== activity)
      throw new Error("Todo's activity cannot be modified");

    await db.Todo.updateOne(
      { _id: id },
      {
        title: title,
        dueTime: dueTime,
        activity: activity,
        description: description,
        priority: priority,
      }
    );

    let target = await db.Todo.findById(id);

    let user = await db.User.findOne({ name: name });

    if (activity) {
      await user.activity.map(async (aId) => {
        let act = await db.Activity.findById(aId);
        if (act.title === current.activity) {
          if (act.users.length !== 1) {
            pubsub.publish(`${act._id} content`, {
              activityContent: {
                mutation: "UPDATED",
                data: act,
              },
            });
          }
        }
      });
    }

    return target;
  },

  async deleteTodo(parent, { id, name, activity }, { db }, info) {
    let user = await db.User.findOne({ name: name });
    await db.Todo.deleteOne({ _id: id });

    if (!activity) {
      await db.User.updateOne({ name: name }, { $pull: { todo: id } });
      return id;
    }

    await user.activity.map(async (aId) => {
      let act = await db.Activity.findById(aId);
      if (act.title === activity) {
        await db.Activity.updateOne({ _id: aId }, { $pull: { todo: id } });
        let newAct = await db.Activity.findById(aId);
        if (newAct.users.length !== 1) {
          pubsub.publish(`${act._id} content`, {
            activityContent: {
              mutation: "DELETED",
              data: newAct,
            },
          });
        }
      }
    });
    return id;
  },

  async createActivity(parent, { users, title }, { db }, info) {
    await users.map(async (user) => {
      if (!(await db.User.findOne({ name: user })))
        throw new Error("User not found.");
    });

    let user = await db.User.findOne({ name: users[0] });
    let add = true;
    await user.activity.map(async (ele) => {
      let a = await db.Activity.findById(ele);
      if (a.title === title) add = false;
    });
    if (!add) {
      throw new Error("Same Activity");
    }

    let newActivity = await new db.Activity({
      title: title,
      users: users,
      progress: [],
      todo: [],
    }).save();

    await users.map(async (user) => {
      await db.User.updateOne(
        { name: user },
        { $push: { activity: newActivity._id } }
      );
      if (users.length !== 1) {
        pubsub.publish(`${user}'s activity`, {
          activity: {
            mutation: "CREATED",
            data: newActivity,
          },
        });
      }
    });

    return newActivity;
  },

  async modifyActivity(parent, { id, users, title }, { db }, info) {
    let target = await db.Activity.findById(id);

    await db.Activity.updateOne({ _id: id }, { title: title, users: users });

    let newAct = await db.Activity.findById(id);

    await target.users.map(async (user) => {
      await db.User.updateOne({ name: user }, { $pull: { activity: id } });
      if (target.users.length !== 1) {
        pubsub.publish(`${user}'s activity`, {
          activity: {
            mutation: "UPDATED",
            data: newAct,
          },
        });
      }
    });

    await users.map(async (user) => {
      await db.User.updateOne({ name: user }, { $push: { activity: id } });
      pubsub.publish(`${user}'s activity`, {
        activity: {
          mutation: "UPDATED",
          data: newAct,
        },
      });
    });

    return newAct;
  },

  async deleteActivity(parent, { id }, { db }, info) {
    let target = await db.Activity.findById(id);
    await target.users.map(async (user) => {
      await db.User.updateOne({ name: user }, { $pull: { activity: id } });
      if (target.users.length !== 1) {
        pubsub.publish(`${user}'s activity`, {
          activity: {
            mutation: "DELETED",
            data: target,
          },
        });
      }
    });
    await target.progress.map(async (p) => {
      await db.Progress.deleteOne({ _id: p });
    });
    await target.todo.map(async (t) => {
      await db.Todo.deleteOne({ _id: t });
    });
    await db.Activity.deleteOne({ _id: id });
    return id;
  },

  async createProgress(parent, { title, dueTime, activity }, { db }, info) {
    let newProgress = await new db.Progress({
      title: title,
      dueTime: dueTime,
    }).save();
    await db.Activity.updateOne(
      { _id: activity },
      { $push: { progress: newProgress._id } }
    );
    let newAct = await db.Activity.findById(activity);
    if (newAct.users.length !== 1) {
      pubsub.publish(`${activity} content`, {
        activityContent: {
          mutation: "CREATED",
          data: newAct,
        },
      });
    }

    return newProgress;
  },

  async modifyProgress(parent, { title, dueTime, id, activity }, { db }, info) {
    await db.Progress.updateOne(
      { _id: id },
      { title: title, dueTime: dueTime }
    );

    let newP = await db.Progress.findById(id);

    let act = await db.Activity.findById(activity);

    if (act.users.length !== 1) {
      pubsub.publish(`${act._id} content`, {
        activityContent: {
          mutation: "UPDATED",
          data: act,
        },
      });
    }

    return newP;
  },

  async deleteProgress(parent, { id, activity }, { db }, info) {
    await db.Activity.updateOne({ _id: activity }, { $pull: { progress: id } });
    let newAct = await db.Activity.findById(activity);
    if (newAct.users.length !== 1) {
      pubsub.publish(`${activity} content`, {
        activityContent: {
          mutation: "DELETED",
          data: newAct,
        },
      });
    }
    await db.Progress.deleteOne({ _id: id });
    return id;
  },
};

export default Mutation;
