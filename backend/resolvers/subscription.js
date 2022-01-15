const Subscription = {
  activity: {
    subscribe(parent, { name }, { db, pubsub }, info) {
      return pubsub.asyncIterator(`${name}'s activity`);
    },
  },
  // progress: {
  //   subscribe(parent, { aId }, { db, pubsub }, info) {
  //     return pubsub.asyncIterator(`progress in ${aId} activity`);
  //   },
  // },
  // todo: {
  //   subscribe(parent, { aId }, { db, pubsub }, info) {
  //     return pubsub.asyncIterator(`todo in ${aId} activity`);
  //   },
  // },
  activityContent: {
    subscribe(parent, { aId }, { db, pubsub }, info) {
      return pubsub.asyncIterator(`${aId} content`);
    },
  },
};

export default Subscription;
