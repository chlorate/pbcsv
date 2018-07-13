import {Value} from ".";
import {formatNumber, getPrecision} from "../math";

/**
 * A numeric value associated to a run.
 */
export class NumberValue extends Value {
	private _number: number;
	private _precision: number;

	get number(): number {
		return this._number;
	}

	get precision(): number {
		return this._precision;
	}

	constructor(s?: string, n?: number, precision?: number) {
		super(s);
		this._number = n || 0;
		this._precision = precision || 0;
	}
}

const formats = [
	{
		// NNN "string" (with optional sign, decimal, and leading zero)
		regExp: /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+"(.+)"$/,
		number: 1,
		string: 2,
	},
	{
		// NNN (with optional sign, decimal, and leading zero)
		regExp: /([+-]?(?:\d+(?:\.\d+)?|\.\d+))/,
		number: 1,
	},
];

/**
 * Parses a string and returns a numeric value or undefined if no number was
 * found.
 */
export function parseNumberValue(s: string): NumberValue | undefined {
	s = s.trim();

	let match: RegExpMatchArray | null = null;
	const commaless = s.replace(/,/g, "")
	const format = formats.find((f) => {
		match = commaless.match(f.regExp);
		return match !== null;
	});
	if (!match || !format) {
		return undefined;
	}

	const matchNumber = match[format.number];
	const n = parseFloat(matchNumber) || 0;
	const precision = getPrecision(matchNumber);

	if (format.string) {
		s = match[format.string].trim();
	}

	return new NumberValue(s, n, precision);
}
