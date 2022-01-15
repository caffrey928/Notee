import { GraphQLServer, PubSub } from "graphql-yoga";
import mongo from "./mongo";
import * as db from "./schema";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/mutation";
import Subscription from "./resolvers/subscription";
import User from "./resolvers/user";
import Activity from "./resolvers/activity";
import { GraphQLDate } from "graphql-iso-date";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Activity,
    Date: GraphQLDate,
  },
  context: {
    db,
    pubsub,
  },
});

mongo();

server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`);
});
