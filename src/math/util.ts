/**
 * Returns a number formatted with commas.
 */
export function formatNumber(n: number): string {
	let s = n.toFixed(6).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	s = s.replace(/0+$/, "");
	s = s.replace(/\.$/, "");
	return s;
}

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
