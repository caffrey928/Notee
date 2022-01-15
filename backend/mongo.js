import mongoose from "mongoose";
import dotenv from "dotenv-defaults";

const mongo = () => {
  dotenv.config();

  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => console.log("mongo db connection created"));

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("Mongo database connected.");
  });
};

export default mongo;
