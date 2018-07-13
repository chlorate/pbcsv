import {NumberValue, parseNumberValue} from ".";

describe("NumberValue", () => {
	it("can return a formatted string", () => {
		const v = new NumberValue("", 1234.5, 3);
		expect(v.formatted).toBe("1,234.500");
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
		},
		{
			name: "can parse NNN.NNN format",
			in: "123.456",
			string: "123.456",
			number: 123.456,
			precision: 3,
		},
		{
			name: "can parse .NNN format",
			in: ".123",
			string: ".123",
			number: 0.123,
			precision: 3,
		},
		{
			name: "can parse -NNN format",
			in: "-1234",
			string: "-1234",
			number: -1234,
			precision: 0,
		},
		{
			name: `can parse NNN "string" format`,
			in: `1234 "test string"`,
			string: "test string",
			number: 1234,
			precision: 0,
		},
		{
			name: `can parse NNN.NNN "string" format`,
			in: `123.456 "test string"`,
			string: "test string",
			number: 123.456,
			precision: 3,
		},
		{
			name: `can parse .NNN "string" format`,
			in: `.123 "test string"`,
			string: "test string",
			number: 0.123,
			precision: 3,
		},
		{
			name: `can parse -NNN "string" format`,
			in: `-1234 "test string"`,
			string: "test string",
			number: -1234,
			precision: 0,
		},
		{
			name: "ignores commas",
			in: "1,234.567,8",
			string: "1,234.567,8",
			number: 1234.5678,
			precision: 4,
		},
		{
			name: "ignores prefixes and suffixes",
			in: "???1234???",
			string: "???1234???",
			number: 1234,
			precision: 0,
		},
		{
			name: "trims whitespace",
			in: "   1234   ",
			string: "1234",
			number: 1234,
			precision: 0,
		},
		{
			name: "trims whitespace inside arbitrary string format",
			in: `   1234    "  test string  "   `,
			string: "test string",
			number: 1234,
			precision: 0,
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseNumberValue(test.in);
			expect(v).not.toBeUndefined();
			if (v) {
				expect(v.string).toBe(test.string);
				expect(v.number).toBe(test.number);
				expect(v.precision).toBe(test.precision);
			}
		});
	});

	it("returns undefined if parsing fails", () => {
		expect(parseNumberValue("???")).toBeUndefined();
	});
});
