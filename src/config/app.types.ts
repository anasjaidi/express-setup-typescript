export type appConfigType = {
	name: string;
	corsOption: {
		origin: string;
	};
	app: {
		port: string | number;
		debug: boolean;
		logger_format: string;
	};
};


