import IntlMessageFormat from "intl-messageformat";

/**
 * Initialize IntlMessageFormat for each message in an object and return an
 * object with the format function for each message.
 */
export function createMessages(messages: {
	[key: string]: string;
}): {[key: string]: (values?: object) => string} {
	const formats = {};
	Object.keys(messages).forEach((key) => {
		formats[key] = new IntlMessageFormat(messages[key], "en").format;
	});
	return formats;
}
