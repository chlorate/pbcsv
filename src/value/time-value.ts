import {approximateRegExp, NumberValue} from ".";

import {
	formatDuration,
	formatLongTime,
	getPrecision,
	hoursToSeconds,
	minutesToSeconds,
} from "../math";

/**
 * A time (or duration) value associated to a run.
 */
export class TimeValue extends NumberValue {
	get formatted(): string {
		return (
			(this.approximate ? "~" : "") +
			formatLongTime(this.number, this.precision)
		);
	}

	get machineFormatted(): string {
		return formatDuration(this.number);
	}
}

const formats = [
	{
		// HH:MM:SS "string" or MM:SS "string" (with optional sign and decimal)
		regExp: /^([+-])?(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)\s+"(.+)"$/,
		sign: 1,
		hours: 2,
		minutes: 3,
		seconds: 4,
		string: 5,
	},
	{
		// HH:MM:SS or MM:SS (with optional sign and decimal, "x" or "?" can
		// be used in minutes or seconds to indicate an approximate time)
		regExp: /([+-])?(?:(\d+):)?([\dx?]+):([\dx?]+(?:\.[\dx?]+)?)/i,
		sign: 1,
		hours: 2,
		minutes: 3,
		seconds: 4,
	},

	// SS and SS.SSS are not accepted here because they are ambiguous; could be
	// a number or a time. Assume it's a number.
];

/**
 * Parses a string and returns a time value or undefined if no time was found.
 */
export function parseTimeValue(s: string): TimeValue | undefined {
	s = s.trim();

	let match: RegExpMatchArray | null = null;
	const format = formats.find((f) => {
		match = s.match(f.regExp);
		return match !== null;
	});
	if (!match || !format) {
		return undefined;
	}

	const matchSign = match[format.sign];
	const matchHours = format.hours ? match[format.hours] : undefined;
	let matchMinutes = match[format.minutes];
	let matchSeconds = match[format.seconds];

	// Approximate times: substitute "x" or "?" for zero.
	let approximate = false;
	if (approximateRegExp.test(matchMinutes + matchSeconds)) {
		matchMinutes = matchMinutes.replace(approximateRegExp, 0);
		matchSeconds = matchSeconds.replace(approximateRegExp, 0);
		approximate = true;
	}

	let hours = 0;
	if (matchHours) {
		hours = parseInt(matchHours, 10) || 0;
	}

	let minutes = 0;
	if (matchMinutes) {
		minutes = parseInt(matchMinutes, 10) || 0;
	}

	const seconds = parseFloat(matchSeconds) || 0;
	const precision = getPrecision(matchSeconds);

	let n = hours * hoursToSeconds + minutes * minutesToSeconds + seconds;
	if (matchSign === "-") {
		n *= -1;
	}

	if (format.string) {
		s = match[format.string].trim();
	}

	return new TimeValue(s, n, precision, approximate);
}
