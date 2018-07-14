import {NumberValue, parseNumberValue} from ".";

describe("NumberValue", () => {
	const v = new NumberValue("", 1234.5, 3);
	const approx = new NumberValue("", 1234.5, 3, true);

	describe("formatted", () => {
		it("can return a string for an exact number", () => {
			expect(v.formatted).toBe("1,234.500");
		});

		it("can return a string for an approximate number", () => {
			expect(approx.formatted).toBe("~1,234.500");
		});
	});

	it("can return a machine-formatted string", () => {
		expect(v.machineFormatted).toBe("1234.5");
	});
});

describe("parseNumberValue", () => {
	[
		{
			name: "can parse NNN format",
			in: "1234",
			string: "1234",
			number: 1234,
			precision: 0,
			approximate: false,
		},
		{
			name: "can parse NNN.NNN format",
			in: "123.456",
			string: "123.456",
			number: 123.456,
			precision: 3,
			approximate: false,
		},
		{
			name: "can parse .NNN format",
			in: ".123",
			string: ".123",
			number: 0.123,
			precision: 3,
			approximate: false,
		},
		{
			name: "can parse -NNN format",
			in: "-1234",
			string: "-1234",
			number: -1234,
			precision: 0,
			approximate: false,
		},
		{
			name: `can parse NNN "string" format`,
			in: `1234 "test string"`,
			string: "test string",
			number: 1234,
			precision: 0,
			approximate: false,
		},
		{
			name: `can parse NNN.NNN "string" format`,
			in: `123.456 "test string"`,
			string: "test string",
			number: 123.456,
			precision: 3,
			approximate: false,
		},
		{
			name: `can parse .NNN "string" format`,
			in: `.123 "test string"`,
			string: "test string",
			number: 0.123,
			precision: 3,
			approximate: false,
		},
		{
			name: `can parse -NNN "string" format`,
			in: `-1234 "test string"`,
			string: "test string",
			number: -1234,
			precision: 0,
			approximate: false,
		},
		{
			name: "can parse approximate NNN.NNN format",
			in: "123x?.1X",
			string: "123x?.1X",
			number: 12300.1,
			precision: 2,
			approximate: true,
		},
		{
			name: "can parse approximate .NNN format",
			in: ".1x?X2",
			string: ".1x?X2",
			number: 0.10002,
			precision: 5,
			approximate: true,
		},
		{
			name: "ignores commas",
			in: "1,234.567,8",
			string: "1,234.567,8",
			number: 1234.5678,
			precision: 4,
			approximate: false,
		},
		{
			name: "ignores prefixes and suffixes",
			in: "zzz1234zzz",
			string: "zzz1234zzz",
			number: 1234,
			precision: 0,
			approximate: false,
		},
		{
			name: "trims whitespace",
			in: "   1234   ",
			string: "1234",
			number: 1234,
			precision: 0,
			approximate: false,
		},
		{
			name: "trims whitespace inside arbitrary string format",
			in: `   1234    "  test string  "   `,
			string: "test string",
			number: 1234,
			precision: 0,
			approximate: false,
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseNumberValue(test.in);
			expect(v).toBeDefined();
			if (v) {
				expect(v.string).toBe(test.string);
				expect(v.number).toBe(test.number);
				expect(v.precision).toBe(test.precision);
				expect(v.approximate).toBe(test.approximate);
			}
		});
	});

	it("returns undefined if parsing fails", () => {
		expect(parseNumberValue("zzz")).toBeUndefined();
	});
});
