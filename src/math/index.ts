export const minutesToSeconds = 60;
export const hoursToSeconds = 60 * minutesToSeconds;

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
 * Returns a number of seconds formatted as a human-readable string. If
 * a precision is given, the string will be fixed to that number of decimal
 * places. Otherwise, decimal places are only shown as necessary.
 */
export function formatSeconds(n: number, precision?: number): string {
	const info = parseSeconds(n);

	const parts: string[] = [];
	if (info.hours) {
		const h = formatNumber(info.sign * info.hours);
		parts.push(`${h} hour${info.hours === 1 ? "" : "s"}`);
	}
	if (info.minutes) {
		const m = info.sign * info.minutes;
		parts.push(`${m} minute${info.minutes === 1 ? "" : "s"}`);
	}
	if (info.seconds || !n) {
		const s = formatNumber(info.sign * info.seconds, precision);
		const plural = s === `${info.sign}`;
		parts.push(`${s} second${plural ? "" : "s"}`);
	}

	return parts.join(", ");
}

/**
 * Returns a number of seconds formatted as an ISO 8601 duration.
 */
export function formatDuration(n: number): string {
	const info = parseSeconds(n);

	let duration = "PT";
	if (info.sign === -1) {
		duration = "-PT";
	}
	if (info.hours) {
		duration += `${info.hours}H`;
	}
	if (info.minutes) {
		duration += `${info.minutes}M`;
	}
	if (info.seconds || !n) {
		duration += `${formatNumber(info.seconds)}S`;
	}
	return duration;
}

interface SecondsInfo {
	sign: number;
	hours: number;
	minutes: number;
	seconds: number;
}

function parseSeconds(n: number): SecondsInfo {
	const sign = n < 0 ? -1 : 1;

	n = Math.abs(n);
	return {
		sign,
		hours: Math.floor(n / hoursToSeconds),
		minutes: Math.floor((n % hoursToSeconds) / minutesToSeconds),
		seconds: n % minutesToSeconds,
	};
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
