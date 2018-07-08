import {Value} from "./value";

/**
 * A numeric value associated to a run.
 */
export class NumberValue extends Value {
	private _number: number;

	get number(): number {
		return this._number;
	}

	constructor(name?: string, s?: string, n?: number) {
		super(name, s);
		this._number = n || 0;
	}
}

// NNN or NNN.NNN or .NNN (with optional sign)
const formatRegExp = /([+-]?(?:\d+(?:\.\d+)?|\.\d+))/;

/**
 * Parses a string and outputs a numeric value or undefined if no number was
 * found.
 */
export function parseNumberValue(
	name: string,
	s: string,
): NumberValue | undefined {
	s = s.trim();

	const match = s.match(formatRegExp);
	if (!match) {
		return undefined;
	}

	let n = 0;
	if (match[1]) {
		n = parseFloat(match[1]) || 0;
	}

	return new NumberValue(name, s, n);
}
