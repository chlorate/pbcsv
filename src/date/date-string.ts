import {computed, observable} from "mobx";
import {DatePrecision} from "pbcsv/date";
import {pad} from "pbcsv/math";

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

interface IProps {
	str?: string;
	date?: Date;
	precision?: DatePrecision;
	ambiguous?: boolean;
}

/**
 * A date parsed from a string. Dates can either be an exact day or an
 * approximate month or year.
 */
export class DateString {
	@observable public string: string;
	@observable public date?: Date;
	@observable public precision?: DatePrecision;
	@observable public ambiguous: boolean;

	constructor({str = "", date, precision, ambiguous = false}: IProps = {}) {
		this.string = str;
		this.date = date;
		this.precision = precision;
		this.ambiguous = ambiguous;
	}

	@computed get approximate(): boolean {
		return (
			this.precision !== undefined && this.precision !== DatePrecision.Day
		);
	}

	/**
	 * Returns an approximate number of days between this date and now, or
	 * undefined if it cannot be determined or if this date is in the future. If
	 * the date precision is month or year, then the end of the month or year
	 * will be used and the minimum number of days since is returned.
	 */
	@computed get daysAgo(): number | undefined {
		if (!this.date) {
			return undefined;
		}

		const date = new Date(this.date);
		switch (this.precision) {
			case DatePrecision.Month:
				date.setMonth(date.getMonth() + 1);
				date.setDate(date.getDate() - 1);
				break;
			case DatePrecision.Year:
				date.setFullYear(date.getFullYear() + 1);
				date.setDate(date.getDate() - 1);
				break;
		}

		const diff = new Date().getTime() - date.getTime();
		if (diff < 0) {
			return undefined;
		}

		return Math.floor(diff / dayToMilliseconds);
	}

	/**
	 * Returns this date formatted as an ISO 8601 string.
	 */
	@computed get iso8601(): string {
		if (!this.date) {
			return "";
		}

		let s = `${this.date.getFullYear()}`;
		if (this.precision === DatePrecision.Year) {
			return s;
		}

		s += `-${pad(this.date.getMonth() + 1, 2)}`;
		if (this.precision === DatePrecision.Month) {
			return s;
		}

		return `${s}-${pad(this.date.getDate(), 2)}`;
	}

	/**
	 * Returns this date in "YYYY", "Month YYYY", or "Month DD, YYYY" format.
	 */
	@computed get longString(): string {
		if (!this.date) {
			return "";
		}

		const year = this.date.getFullYear();
		const month = months[this.date.getMonth()];
		const day = this.date.getDate();

		switch (this.precision) {
			case DatePrecision.Year:
				return `${year}`;
			case DatePrecision.Month:
				return `${month} ${year}`;
			default:
				return `${month} ${day}, ${year}`;
		}
	}
}

const formats = [
	{
		// MM-DD-YYYY or MM/DD/YYYY
		regExp: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4,})/,
		year: 3,
		month: 1,
		day: 2,
		ambiguous: true,
	},
	{
		// MM-YYYY or MM/YYYY
		regExp: /(\d{1,2})[-\/](\d{4,})/,
		year: 2,
		month: 1,
		ambiguous: false,
	},
	{
		// YYYY, YYYY-MM, YYYY/MM, YYYY-MM-DD, or YYYY/MM/DD
		regExp: /(\d{4,})(?:[-\/](\d{1,2}))?(?:[-\/](\d{1,2}))?/,
		year: 1,
		month: 2,
		day: 3,
		ambiguous: false,
	},
	{
		// MM-DD-YY or MM/DD/YY
		regExp: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2})/,
		year: 3,
		month: 1,
		day: 2,
		ambiguous: true,
	},
];

/**
 * Parses a string and returns a DateString or undefined if no date was found.
 */
export function parseDateString(s: string): DateString {
	s = s.trim();

	const format = formats.find((f) => f.regExp.test(s));
	if (!format) {
		return new DateString({str: s});
	}

	const match = s.match(format.regExp);
	if (!match || !match[format.year]) {
		return new DateString({str: s});
	}

	let year = parseInt(match[format.year], 10);
	let precision = DatePrecision.Year;
	if (year < 100) {
		year += 2000;
	}

	let month: number | undefined;
	if (match[format.month] !== undefined) {
		month = parseInt(match[format.month], 10);
	}
	if (month === undefined || isNaN(month)) {
		month = 1;
	} else {
		precision = DatePrecision.Month;
	}

	let day: number | undefined;
	if (format.day && match[format.day] !== undefined) {
		day = parseInt(match[format.day], 10);
	}
	if (day === undefined || isNaN(day)) {
		day = 1;
	} else {
		precision = DatePrecision.Day;
	}

	return new DateString({
		str: s,
		date: new Date(year, month - 1, day),
		precision,
		ambiguous: format.ambiguous,
	});
}
