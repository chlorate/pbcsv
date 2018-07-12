import {parseNumberValue} from ".";

describe("parseNumberValue", () => {
	[
		{
			name: "can parse NNN format",
			in: "1234",
			string: "1234",
			number: 1234,
		},
		{
			name: "can parse NNN.NNN format",
			in: "123.456",
			string: "123.456",
			number: 123.456,
		},
		{
			name: "can parse .NNN format",
			in: ".123",
			string: ".123",
			number: 0.123,
		},
		{
			name: "can parse -NNN format",
			in: "-1234",
			string: "-1234",
			number: -1234,
		},
		{
			name: `can parse NNN "string" format`,
			in: `1234 "test string"`,
			string: "test string",
			number: 1234,
		},
		{
			name: `can parse NNN.NNN "string" format`,
			in: `123.456 "test string"`,
			string: "test string",
			number: 123.456,
		},
		{
			name: `can parse .NNN "string" format`,
			in: `.123 "test string"`,
			string: "test string",
			number: 0.123,
		},
		{
			name: `can parse -NNN "string" format`,
			in: `-1234 "test string"`,
			string: "test string",
			number: -1234,
		},
		{
			name: "ignores prefixes and suffixes",
			in: "???1234???",
			string: "???1234???",
			number: 1234,
		},
		{
			name: "trims whitespace",
			in: "   1234   ",
			string: "1234",
			number: 1234,
		},
		{
			name: "trims whitespace inside arbitrary string format",
			in: `   1234    "  test string  "   `,
			string: "test string",
			number: 1234,
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseNumberValue(test.in);
			expect(v).not.toBeUndefined();
			if (v) {
				expect(v.string).toBe(test.string);
				expect(v.number).toBe(test.number);
			}
		});
	});

	it("returns undefined if parsing fails", () => {
		expect(parseNumberValue("???")).toBeUndefined();
	});
});
