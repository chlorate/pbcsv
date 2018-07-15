import {formatNumber, pad} from ".";

export const minutesToSeconds = 60;
export const hoursToSeconds = 60 * minutesToSeconds;

/**
 * Returns a number of seconds in HH:MM:SS format. If a precision is given, the
 * string will be fixed to that number of decimal places. Otherwise, decimal
 * places are only shown as necessary.
 */
export function formatTime(seconds: number, precision?: number): string {
	const units = parseTime(seconds);

	const parts: string[] = [];
	if (units.hours) {
		parts.push(`${units.hours}`);
	}
	if (units.hours || units.minutes) {
		parts.push(`${units.minutes}`)
	}
	parts.push(`${formatNumber(units.seconds, precision)}`)

	if (units.sign < 0) {
		parts[0] = `-${parts[0]}`;
	}
	for (let i = 1; i < parts.length; i++) {
		parts[i] = pad(parts[i], 2);
	}

	return parts.join(":");
}

/**
 * Returns a number of seconds in "HH hours, MM minutes, SS seconds" format. If
 * a precision is given, the string will be fixed to that number of decimal
 * places. Otherwise, decimal places are only shown as necessary.
 */
export function formatLongTime(seconds: number, precision?: number): string {
	const units = parseTime(seconds);

	const parts: string[] = [];
	if (units.hours) {
		const h = formatNumber(units.sign * units.hours);
		parts.push(`${h} hour${units.hours === 1 ? "" : "s"}`);
	}
	if (units.minutes) {
		const m = units.sign * units.minutes;
		parts.push(`${m} minute${units.minutes === 1 ? "" : "s"}`);
	}
	if (units.seconds || !seconds) {
		const s = formatNumber(units.sign * units.seconds, precision);
		const plural = s === `${units.sign}`;
		parts.push(`${s} second${plural ? "" : "s"}`);
	}
	return parts.join(", ");
}

/**
 * Returns a number of seconds formatted as an ISO 8601 duration.
 */
export function formatDuration(seconds: number): string {
	const units = parseTime(seconds);

	let duration = "PT";
	if (units.sign === -1) {
		duration = `-${duration}`;
	}
	if (units.hours) {
		duration += `${units.hours}H`;
	}
	if (units.minutes) {
		duration += `${units.minutes}M`;
	}
	if (units.seconds || !seconds) {
		duration += `${formatNumber(units.seconds)}S`;
	}
	return duration;
}

interface TimeUnits {
	sign: number;
	hours: number;
	minutes: number;
	seconds: number;
}

function parseTime(seconds: number): TimeUnits {
	const sign = seconds < 0 ? -1 : 1;

	seconds = Math.abs(seconds);
	return {
		sign,
		hours: Math.floor(seconds / hoursToSeconds),
		minutes: Math.floor((seconds % hoursToSeconds) / minutesToSeconds),
		seconds: seconds % minutesToSeconds,
	};
}
