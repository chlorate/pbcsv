/**
 * Zero pads a number.
 */
export function pad(n: number, length: number): string {
	const s = `${n}`;
	if (s.length >= length) {
		return s;
	}
	return new Array(length - s.length + 1).join("0") + s;
}
