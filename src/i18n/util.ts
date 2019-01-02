import IntlMessageFormat from "intl-messageformat";

const customFormats = {
	date: {
		month: {
			month: "long",
			year: "numeric",
		},
		year: {
			year: "numeric",
		},
	},
};

/**
 * Initialize IntlMessageFormat for each message in an object and return an
 * object with the format function for each message.
 */
export function createMessages(messages: {
	[key: string]: string;
}): {[key: string]: (values?: object) => string} {
	const formats = {};
	Object.keys(messages).forEach((key) => {
		const message = new IntlMessageFormat(
			messages[key],
			"en",
			customFormats,
		);
		formats[key] = message.format;
	});
	return formats;
}
