import app from "../app/app";
// import mongoConnection from "../databases/mongo/connection/mongo.db";
import prismaClientDb from "../databases/prisma/prismaClient.db";

const port = app.get("port");
const env = app.get("env");
const debug = app.get("debug");

// start listening on port specified
const server = app.listen(port);

server.on("listening", () => {
	console.log(`* Environment : ${env}`);
	console.log(`* Debugger : ${debug ? "On" : "Off"}`);
	console.log(`* Running on http://localhost:${port} (CTRL + C to quit)`);
});

// handle uncatched Rejections and exceptions
process.on("SIGINT", async () => {
	
	try {
		server.close(); // Close the Node.js server
		console.log("\n\n\nCTRL^C 💥 Server shutting down... \n\n");

		// await mongoConnection.close(); // Close the MongoDB connection

		await prismaClientDb.$disconnect(); // Disconnect from Prisma
		console.log("\n\nPrisma disconnected 💥.");

		process.exit(0); // Exit the process with a success code
	} catch (error) {
		console.error(`Error during shutdown: ${error}`);
		process.exit(1); // Exit the process with a failure code
	}
});

process.on("unhandledRejection", (err: Error) => {
	console.log("Unhandled Rejection! 💥 Server shuting Down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});


