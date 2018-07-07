import {DatePrecision} from "./date-precision";

/**
 * A date that is either exact day or an approximate month or year.
 */
export class ApproxDate {
	private _string: string;
	private _date: Date;
	private _precision: DatePrecision;

	get string() {
		return this._string;
	}

	get date() {
		return this._date;
	}

	get precision() {
		return this._precision;
	}

	constructor(str, date, precision) {
		this._string = str;
		this._date = date;
		this._precision = precision;
	}
}

const monthOrDay = "(?:[-\\/](\\d+))?";
const dateRegExp = new RegExp("(\\d{4,})" + monthOrDay.repeat(2));

/**
 * Parses a string and outputs an approximate date or undefined if no date was
 * found.
 */
export function parseApproxDate(s: string): ApproxDate | undefined {
	s = s.trim();

	const match = s.match(dateRegExp);
	if (!match) {
		return undefined;
	}

	const year = parseInt(match[1], 10);
	let precision = DatePrecision.Year;

	let month = parseInt(match[2], 10);
	if (isNaN(month)) {
		month = 1;
	} else {
		precision = DatePrecision.Month;
	}

	let day = parseInt(match[3], 10);
	if (isNaN(day)) {
		day = 1;
	} else {
		precision = DatePrecision.Day;
	}

	const date = new Date(year, month - 1, day);
	return new ApproxDate(s, date, precision);
}
