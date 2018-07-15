import {formatDuration, formatLongTime, formatTime} from ".";

describe("formatTime", () => {
	[
		{in: -3661, out: "-1:01:01"},
		{in: 0, out: "0"},
		{in: 1, out: "1"},
		{in: 59, out: "59"},
		{in: 60, out: "1:00"},
		{in: 61, out: "1:01"},
		{in: 3599, out: "59:59"},
		{in: 3600, out: "1:00:00"},
		{in: 3601.234, out: "1:00:01.234"},
		{in: 3601.234, precision: 0, out: "1:00:01"},
		{in: 3601.234, precision: 6, out: "1:00:01.234000"},
		{in: 36610, out: "10:10:10"},
		{in: 3600000, out: "1000:00:00"},
	].forEach((test) => {
		const name =
			`should return "${test.out}" for ${test.in} ` +
			`with precision ${test.precision}`;
		it(name, () => {
			expect(formatTime(test.in, test.precision)).toBe(test.out);
		});
	});
});

describe("formatLongTime", () => {
	[
		{in: -3661, out: "-1 hour, -1 minute, -1 second"},
		{in: 0, out: "0 seconds"},
		{in: 1, out: "1 second"},
		{in: 59, out: "59 seconds"},
		{in: 60, out: "1 minute"},
		{in: 3599, out: "59 minutes, 59 seconds"},
		{in: 3600, out: "1 hour"},
		{in: 3601.234, out: "1 hour, 1.234 seconds"},
		{in: 3601.234, precision: 0, out: "1 hour, 1 second"},
		{in: 3601.234, precision: 6, out: "1 hour, 1.234000 seconds"},
		{in: 36610, out: "10 hours, 10 minutes, 10 seconds"},
		{in: 3600000, out: "1,000 hours"},
	].forEach((test) => {
		const name =
			`should return "${test.out}" for ${test.in} ` +
			`with precision ${test.precision}`;
		it(name, () => {
			expect(formatLongTime(test.in, test.precision)).toBe(test.out);
		});
	});
});

describe("formatDuration", () => {
	[
		{in: -3661, out: "-PT1H1M1S"},
		{in: 0, out: "PT0S"},
		{in: 1, out: "PT1S"},
		{in: 59, out: "PT59S"},
		{in: 60, out: "PT1M"},
		{in: 3599, out: "PT59M59S"},
		{in: 3600, out: "PT1H"},
		{in: 3601.234, out: "PT1H1.234S"},
		{in: 36610, out: "PT10H10M10S"},
		{in: 3600000, out: "PT1000H"},
	].forEach((test) => {
		it(`should return "${test.out}" for ${test.in}`, () => {
			expect(formatDuration(test.in)).toBe(test.out);
		});
	});
});
