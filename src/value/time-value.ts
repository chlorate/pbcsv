import {NumberValue} from ".";

/**
 * A time (or duration) value associated to a run.
 */
export class TimeValue extends NumberValue {}

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
		// HH:MM:SS or HH:MM:SS.SSS (with optional sign)
		regExp: /([+-])?(\d+):(\d+):(\d+(?:\.\d+)?)/,
		sign: 1,
		hours: 2,
		minutes: 3,
		seconds: 4,
	},
	{
		// MM:SS or MM:SS.SSS (with optional sign)
		regExp: /([+-])?(\d+):(\d+(?:\.\d+)?)/,
		sign: 1,
		minutes: 2,
		seconds: 3,
	},
	// SS and SS.SSS are not accepted here because they are ambiguous; could be
	// a number or a time. Assume it's a number.
];

const minutesToSeconds = 60;
const hoursToSeconds = 60 * minutesToSeconds;

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
	const matchMinutes = match[format.minutes];
	const matchSeconds = match[format.seconds];

	let hours = 0;
	if (matchHours) {
		hours = parseInt(matchHours, 10) || 0;
	}

	let minutes = 0;
	if (matchMinutes) {
		minutes = parseInt(matchMinutes, 10) || 0;
	}

	let seconds = 0;
	if (matchSeconds) {
		seconds = parseFloat(matchSeconds) || 0;
	}

	let n = hours * hoursToSeconds + minutes * minutesToSeconds + seconds;
	if (matchSign === "-") {
		n *= -1;
	}

	if (format.string) {
		s = match[format.string].trim();
	}

	return new TimeValue(s, n);
}
