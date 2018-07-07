/**
 * Contains a date and the original user input string.
 */
export class DateString {
	private _string: string;
	private _date: Date;

	get string() {
		return this._string;
	}

	get date() {
		return this._date;
	}

	constructor(str, date) {
		this._string = str;
		this._date = date;
	}
}

/**
 * Attempts to find a date in a string and parses it. Returns undefined if
 * no date was found.
 */
export function parseDate(str: string): DateString | undefined {
	str = str.trim();

	const match = str.match(/(\d{4,})(?:[-\/](\d+))?(?:[-\/](\d+))?/);
	if (!match) {
		return undefined;
	}

	const year = parseInt(match[1], 10);

	let month = parseInt(match[2], 10);
	if (isNaN(month)) {
		month = 1;
	}

	let day = parseInt(match[3], 10);
	if (isNaN(day)) {
		day = 1;
	}

	const date = new Date(year, month - 1, day);
	return new DateString(str, date);
}
