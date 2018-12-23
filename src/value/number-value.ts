import {Value} from ".";
import {formatNumber, getPrecision} from "../math";

/**
 * A numeric value associated to a run.
 */
export class NumberValue extends Value {
	private _number: number;
	private _precision: number;
	private _approximate: boolean;

	get number(): number {
		return this._number;
	}

	get precision(): number {
		return this._precision;
	}

	get approximate(): boolean {
		return this._approximate;
	}

	get formatted(): string {
		return (
			(this.approximate ? "~" : "") +
			formatNumber(this.number, this.precision)
		);
	}

	get machineFormatted(): string {
		return `${this.number}`;
	}

	constructor(
		s?: string,
		n?: number,
		precision?: number,
		approximate?: boolean,
	) {
		super(s);
		this._number = n || 0;
		this._precision = precision || 0;
		this._approximate = approximate || false;
	}
}

const formatRegExps = [
	// NNN "string" (with optional sign, decimal, and leading zero)
	/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+"(.+)"$/,

	// NNN (with optional sign, decimal, and leading zero, "x" or "?" can be
	// used to indicate an approximate number)
	/([+-]?(?:[\dx?]+(?:\.[\dx?]+)?|\.[\dx?]+))/i,
];

export const approximateRegExp = /[x?]/gi;

/**
 * Parses a string and returns a numeric value or undefined if no number was
 * found.
 */
export function parseNumberValue(s: string): NumberValue | undefined {
	s = s.trim();
	const commaless = s.replace(/,/g, "");

	const regExp = formatRegExps.find((re) => re.test(commaless));
	if (!regExp) {
		return undefined;
	}

	const match = commaless.match(regExp);
	if (!match) {
		return undefined;
	}
	let matchNumber = match[1];
	const matchString = match[2];

	// Approximate numbers: substitute "x" or "?" for zero.
	let approximate = false;
	if (approximateRegExp.test(matchNumber)) {
		matchNumber = matchNumber.replace(approximateRegExp, "0");
		approximate = true;
	}

	const n = parseFloat(matchNumber) || 0;
	const precision = getPrecision(matchNumber);

	if (matchString) {
		s = matchString.trim();
	}

	return new NumberValue(s, n, precision, approximate);
}
