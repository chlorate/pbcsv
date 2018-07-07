/**
 * Returns a number formatted with commas.
 */
export function formatNumber(n: number): string {
	let out = n.toFixed(6).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	out = out.replace(/0+$/, "");
	out = out.replace(/\.$/, "");
	return out;
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
