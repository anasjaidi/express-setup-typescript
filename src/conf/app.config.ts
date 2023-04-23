const CommonConfs = {
	corsOption: {
		origin: "*", // TODO: change in production mode
	},
	app: {
		port: process.env.PORT || 3004,
		debug: process.env.DEBUGGER?.toLowerCase() === "true" ? true : false,
		logger_format: process.env.MORGAN_MODE || "combined",
	},
};

const devConfig = { ...CommonConfs, name: "development" };

const testConfig = { ...CommonConfs, name: "testing" };

const proConfig = { ...CommonConfs, name: "production" };

const configs = [devConfig, testConfig, proConfig];

export default (mode = "development") =>
	configs.find((conf) => conf.name === mode);
