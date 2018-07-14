import {parseNumberValue, parseTimeValue} from ".";

/**
 * An object containing values keyed by name.
 */
export interface Values {
	[name: string]: Value;
}

/**
 * Value represents some arbitrary string value associated to a run.
 */
export class Value {
	private _string: string;

	get string(): string {
		return this._string;
	}

	get number(): number | undefined {
		return undefined;
	}

	get precision(): number | undefined {
		return undefined;
	}

	get approximate(): boolean {
		return false;
	}

	get formatted(): string | undefined {
		return undefined;
	}

	get machineFormatted(): string | undefined {
		return undefined;
	}

	constructor(s?: string) {
		this._string = s || "";
	}
}

/**
 * Parses a string and returns a time, number, or string value, or undefined if
 * the input string is empty.
 */
export function parseValue(s: string): Value | undefined {
	s = s.trim();
	if (!s) {
		return undefined;
	}

	let v: Value | undefined = parseTimeValue(s);
	if (!v) {
		v = parseNumberValue(s);
	}
	if (!v) {
		v = new Value(s);
	}
	return v;
}
