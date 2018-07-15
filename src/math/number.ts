/**
 * Returns a number formatted with commas. If a precision is given, the string
 * will be fixed to that number of decimal places. Otherwise, decimal places are
 * only shown as necessary.
 */
export function formatNumber(n: number, precision?: number): string {
	let s = n.toFixed(precision || 6);
	s = s.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

	switch (precision) {
		case 0:
			s = s.split(".")[0];
			break;
		case undefined:
			s = s.replace(/0+$/, "");
			s = s.replace(/\.$/, "");
			break;
	}

	return s;
}

/**
 * Returns the number of places after a number's decimal point. The number has
 * to be a string to account for any trailing zeroes.
 */
export function getPrecision(s: string): number {
	const decimal = s.replace(/[^\d.]/g, "").split(".")[1] || "";
	return decimal.length;
}

/**
 * Zero pads a number to some number of digits before the decimal.
 */
export function pad(n: number | string, digits: number): string {
	const parts = `${n}`.split(".");
	while (parts[0].length < digits) {
		parts[0] = `0${parts[0]}`;
	}
	return parts.join(".");
}
