const appSettings = {
	log4js: {
		consoleLogConfig: {
			appenders: {
				consoleAppender: {
					type: "console",
					layout: {
						type: "pattern",
						pattern: "%d - %c:[%p]: %m",
					},
				},
			},
			categories: {
				default: { appenders: ["consoleAppender"], level: "debug" },
			},
		},
		traceLogConfig: {
			appenders: {
				fileAppender: {
					type: "file",
					filename: "./logs/trace.log",
					maxLogSize: "1M",
					compress: true,
					keepFileExt: true,
				},
				consoleAppender: { type: "console" },
			},
			categories: {
				default: {
					appenders: ["fileAppender"],
					level: "trace",
				},
			},
		},
	},
};
module.exports = appSettings;