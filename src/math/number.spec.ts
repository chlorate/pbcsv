import {formatNumber, getPrecision, pad} from ".";

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

describe("pad", () => {
	[
		{in: 123, digits: 6, out: "000123"},
		{in: 123, digits: 3, out: "123"},
		{in: 123, digits: 2, out: "123"},
		{in: 123.456, digits: 6, out: "000123.456"},
		{in: "123.400", digits: 6, out: "000123.400"},
	].forEach((test) => {
		const name =
			`should return ${test.out} for ${test.in} ` +
			`with ${test.digits} digits`;
		it(name, () => {
			expect(pad(test.in, test.digits)).toBe(test.out);
		});
	});
});
