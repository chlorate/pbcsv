import {pad} from "../math/util";
import {DatePrecision} from "./date-precision";

const dayToMilliseconds = 24 * 60 * 60 * 1000;

// TODO: Should use Date.toLocaleDateString but Chrome and Firefox want to have
// a whack-a-mole game of "unsupported time zone specified" errors when running
// tests, so I can't be bothered to figure it out right now.
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

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
		return new Date(this._date);
	}

	get precision() {
		return this._precision;
	}

	/**
	 * Returns an approximate number of days between this date and now or
	 * undefined if it cannot be determined or if this date is in the future. If
	 * the date precision is month or year, then the end of the month or year
	 * will be used and the minimum number of days since is returned.
	 */
	get daysAgo(): number | undefined {
		const now = new Date();

		const then = this.date;
		switch (this.precision) {
			case DatePrecision.Month:
				then.setMonth(then.getMonth() + 1);
				then.setDate(then.getDate() - 1);
				break;
			case DatePrecision.Year:
				then.setFullYear(then.getFullYear() + 1);
				then.setDate(then.getDate() - 1);
				break;
		}

		const diff = now.getTime() - then.getTime();
		if (diff < 0) {
			return undefined;
		}

		return Math.floor(diff / dayToMilliseconds);
	}

	/**
	 * Returns this date formatted as an ISO-8601 string.
	 */
	get iso8601(): string {
		let s = `${this._date.getFullYear()}`;
		if (this.precision === DatePrecision.Year) {
			return s;
		}

		s += `-${pad(this._date.getMonth() + 1, 2)}`;
		if (this.precision === DatePrecision.Month) {
			return s;
		}

		return `${s}-${pad(this._date.getDate(), 2)}`;
	}

	/**
	 * Returns this date in "YYYY", "Month YYYY", or "Month DD, YYYY" format.
	 */
	get fullString(): string {
		const year = this._date.getFullYear();
		const month = months[this._date.getMonth()];
		const day = this._date.getDate();

		switch (this.precision) {
			case DatePrecision.Year:
				return `${year}`;
			case DatePrecision.Month:
				return `${month} ${year}`;
			default:
				return `${month} ${day}, ${year}`;
		}
	}

	constructor(s: string, d: Date, p: DatePrecision) {
		this._string = s;
		this._date = d;
		this._precision = p;
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
