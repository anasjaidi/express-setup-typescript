import app from "../app/app";

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
process.on("SIGINT", () => {
	server.close(() => {
		console.log("server Shuting down.. 🛑");
		process.exit(1);
	});
});

process.on("unhandledRejection", (err: Error) => {
	console.log("Unhandled Rejection! 💥 Server shuting Down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on("SIGINT", () => {
	console.log("\nCTRL^C 💥 Server shuting Down...");
	server.close(() => {
		process.exit(1);
	});
});
