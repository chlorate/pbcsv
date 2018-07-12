import {parseTimeValue} from ".";

describe("parseTimeValue", () => {
	[
		{
			name: "can parse MM:SS format",
			in: "12:34",
			string: "12:34",
			number: 754,
		},
		{
			name: "can parse MM:SS.SSS format",
			in: "12:34.567",
			string: "12:34.567",
			number: 754.567,
		},
		{
			name: "can parse -MM:SS format",
			in: "-12:34",
			string: "-12:34",
			number: -754,
		},
		{
			name: "can parse HH:MM:SS format",
			in: "12:34:56",
			string: "12:34:56",
			number: 45296,
		},
		{
			name: "can parse HH:MM:SS.SSS format",
			in: "12:34:56.789",
			string: "12:34:56.789",
			number: 45296.789,
		},
		{
			name: "can parse -HH:MM:SS format",
			in: "-12:34:56",
			string: "-12:34:56",
			number: -45296,
		},
		{
			name: `can parse HH:MM:SS "string" format`,
			in: `12:34:56 "test string"`,
			string: "test string",
			number: 45296,
		},
		{
			name: `can parse HH:MM:SS.SSS "string" format`,
			in: `12:34:56.789 "test string"`,
			string: "test string",
			number: 45296.789,
		},
		{
			name: `can parse MM:SS "string" format`,
			in: `12:34 "test string"`,
			string: "test string",
			number: 754,
		},
		{
			name: `can parse -HH:MM:SS "string" format`,
			in: `-12:34:56 "test string"`,
			string: "test string",
			number: -45296,
		},
		{
			name: "ignores prefixes and suffixes",
			in: "???12:34:56???",
			string: "???12:34:56???",
			number: 45296,
		},
		{
			name: "trims whitespace",
			in: "   12:34:56   ",
			string: "12:34:56",
			number: 45296,
		},
		{
			name: "trims whitespace inside arbitrary string format",
			in: `   12:34:56    "  test string  "   `,
			string: "test string",
			number: 45296,
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseTimeValue(test.in);
			expect(v).not.toBeUndefined();
			if (v) {
				expect(v.string).toBe(test.string);
				expect(v.number).toBe(test.number);
			}
		});
	});

	[
		{
			name: "returns undefined for seconds only",
			in: "12",
		},
		{
			name: "returns undefined if parsing fails",
			in: "???",
		},
	].forEach((test) => {
		it(test.name, () => {
			expect(parseTimeValue(test.in)).toBeUndefined();
		});
	});
});
