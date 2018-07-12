import {parseNumberValue} from "./number-value";
import {parseTimeValue} from "./time-value";
import {Value} from "./value";

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
