import {Value} from "./value";

/**
 * A time (or duration) value associated to a run.
 */
export class TimeValue extends Value {
	private _number: number;

	get number(): number {
		return this._number;
	}

	constructor(name?: string, s?: string, n?: number) {
		super(name, s);
		this._number = n || 0;
	}
}

const formats = [
	{
		// HH:MM:SS or HH:MM:SS.SSS
		regExp: /([+-])?(\d+):(\d+):(\d+(?:\.\d+)?)/,
		sign: 1,
		hours: 2,
		minutes: 3,
		seconds: 4,
	},
	{
		// MM:SS or MM:SS.SSS
		regExp: /([+-])?(\d+):(\d+(?:\.\d+)?)/,
		sign: 1,
		minutes: 2,
		seconds: 3,
	},
]

const minutesToSeconds = 60;
const hoursToSeconds = 60 * minutesToSeconds;

/**
 * Parses a string and outputs a time value or undefined if no time was found.
 */
export function parseTimeValue(name: string, s: string): TimeValue | undefined {
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

	return new TimeValue(name, s, n);
}
