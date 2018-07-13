export const minutesToSeconds = 60;
export const hoursToSeconds = 60 * minutesToSeconds;

/**
 * Returns a number formatted with commas. If a precision is given, the string
 * will be fixed to that number of decimal places. Otherwise, decimal places are
 * only shown as necessary.
 */
export function formatNumber(n: number, precision?: number): string {
	let s = n.toFixed(precision || 6)
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
 * Returns a number of seconds formatted as a human-readable string. If
 * a precision is given, the string will be fixed to that number of decimal
 * places. Otherwise, decimal places are only shown as necessary.
 */
export function formatSeconds(n: number, precision?: number): string {
	const sign = n < 0 ? -1 : 1;

	n = Math.abs(n);
	const hours = sign * Math.floor(n / hoursToSeconds);
	const minutes = sign * Math.floor((n % hoursToSeconds) / minutesToSeconds);
	const seconds = sign * (n % minutesToSeconds);

	const parts: string[] = [];
	if (hours) {
		const h = formatNumber(hours);
		parts.push(`${h} hour${hours === sign ? "" : "s"}`);
	}
	if (minutes) {
		parts.push(`${minutes} minute${minutes === sign ? "" : "s"}`);
	}
	if (seconds || !n) {
		const s = formatNumber(seconds, precision);
		parts.push(`${s} second${s === `${sign}` ? "" : "s"}`);
	}

	return parts.join(", ");
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
 * Zero pads a number.
 */
export function pad(n: number, length: number): string {
	const s = `${n}`;
	if (s.length >= length) {
		return s;
	}
	return new Array(length - s.length + 1).join("0") + s;
}
