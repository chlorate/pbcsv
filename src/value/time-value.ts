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

const formatRegExps = [
	// HH:MM:SS "string" or MM:SS "string" (with optional sign and decimal)
	/^([+-])?(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)\s+"(.+)"$/,

	// HH:MM:SS or MM:SS (with optional sign and decimal, "x" or "?" can
	// be used in minutes or seconds to indicate an approximate time)
	/([+-])?(?:(\d+):)?([\dx?]+):([\dx?]+(?:\.[\dx?]+)?)/i,

	// SS and SS.SSS are not accepted here because they are ambiguous; could be
	// a number or a time. Assume it's a number.
];

/**
 * Parses a string and returns a time value or undefined if no time was found.
 */
export function parseTimeValue(s: string): TimeValue | undefined {
	s = s.trim();

	const regExp = formatRegExps.find((re) => re.test(s));
	if (!regExp) {
		return undefined;
	}

	const match = s.match(regExp);
	if (!match) {
		return undefined;
	}
	const matchSign = match[1];
	const matchHours = match[2];
	let matchMinutes = match[3];
	let matchSeconds = match[4];
	const matchString = match[5];

	// Approximate times: substitute "x" or "?" for zero.
	let approximate = false;
	if (approximateRegExp.test(matchMinutes + matchSeconds)) {
		matchMinutes = matchMinutes.replace(approximateRegExp, "0");
		matchSeconds = matchSeconds.replace(approximateRegExp, "0");
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

	if (matchString) {
		s = matchString.trim();
	}

	return new TimeValue(s, n, precision, approximate);
}
