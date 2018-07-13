import {formatNumber, formatSeconds, getPrecision, pad} from ".";

describe("getPrecision", () => {
	[
		{in: "0.5", out: 1},
		{in: "1", out: 0},
		{in: "1.100", out: 3},
		{in: "1.123", out: 3},
	].forEach((test) => {
		it(`should return ${test.out} for ${test.in}`, () => {
			expect(getPrecision(test.in)).toBe(test.out);
		});
	});
});

describe("formatNumber", () => {
	[
		{in: -1000, out: "-1,000"},
		{in: -1, out: "-1"},
		{in: 1, out: "1"},
		{in: 12, out: "12"},
		{in: 123, out: "123"},
		{in: 1234, out: "1,234"},
		{in: 12345, out: "12,345"},
		{in: 123456, out: "123,456"},
		{in: 1234567, out: "1,234,567"},
		{in: 1234567.8, out: "1,234,567.8"},
		{in: 1234567.89, out: "1,234,567.89"},
		{in: 1234567.891, out: "1,234,567.891"},
		{in: 1234567.8912, out: "1,234,567.8912"},
		{in: 1234567.8912, precision: 0, out: "1,234,567"},
		{in: 1234567.8912, precision: 6, out: "1,234,567.891200"},
	].forEach((test) => {
		const name =
			`should return ${test.out} for ${test.in} ` +
			`with precision ${test.precision}`;
		it(name, () => {
			expect(formatNumber(test.in, test.precision)).toBe(test.out);
		});
	});
});

describe("formatSeconds", () => {
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
			expect(formatSeconds(test.in, test.precision)).toBe(test.out);
		});
	});
});

describe("pad", () => {
	it("should pad if number length is less than pad length", () => {
		expect(pad(123, 6)).toBe("000123");
	});

	it("should return as-is if number and pad length are equal", () => {
		expect(pad(123, 3)).toBe("123");
	});

	it("should return as-is if number length exceeds pad length", () => {
		expect(pad(123, 2)).toBe("123");
	});
});
