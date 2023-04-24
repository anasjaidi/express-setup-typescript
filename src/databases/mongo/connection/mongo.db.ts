import mongoose, { ConnectOptions } from "mongoose";
import mongoConfig from "../config/mongo.config";

const mongoConnection = mongoose.createConnection(
	mongoConfig.mongo_db_url!,
	mongoConfig.mongo_options as ConnectOptions
);

mongoConnection.on("connected", () => console.log("\nMongo DB connected ✅"));

mongoConnection.on("error", () => console.log("Mongo DB not connected 💥"));

mongoConnection.on("disconnected", () => {
	console.log("Disconnected from MongoDB 💥.");
});


export default mongoConnection;