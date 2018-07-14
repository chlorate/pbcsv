import {parseTimeValue, TimeValue} from ".";

describe("TimeValue", () => {
	const v = new TimeValue("", 3620.3, 3);
	const approx = new TimeValue("", 3620.3, 3, true);

	describe("formatted", () => {
		it("can return a string for an exact time", () => {
			expect(v.formatted).toBe("1 hour, 20.300 seconds");
		});

		it("can return a string for an approximate time", () => {
			expect(approx.formatted).toBe("~1 hour, 20.300 seconds");
		});
	});

	it("can return a machine-formatted string", () => {
		expect(v.machineFormatted).toBe("PT1H20.3S");
	});
});

describe("parseTimeValue", () => {
	[
		{
			name: "can parse MM:SS format",
			in: "12:34",
			string: "12:34",
			number: 754,
			precision: 0,
			approximate: false,
		},
		{
			name: "can parse MM:SS.SSS format",
			in: "12:34.567",
			string: "12:34.567",
			number: 754.567,
			precision: 3,
			approximate: false,
		},
		{
			name: "can parse -MM:SS format",
			in: "-12:34",
			string: "-12:34",
			number: -754,
			precision: 0,
			approximate: false,
		},
		{
			name: "can parse HH:MM:SS format",
			in: "12:34:56",
			string: "12:34:56",
			number: 45296,
			precision: 0,
			approximate: false,
		},
		{
			name: "can parse HH:MM:SS.SSS format",
			in: "12:34:56.789",
			string: "12:34:56.789",
			number: 45296.789,
			precision: 3,
			approximate: false,
		},
		{
			name: "can parse -HH:MM:SS format",
			in: "-12:34:56",
			string: "-12:34:56",
			number: -45296,
			precision: 0,
			approximate: false,
		},
		{
			name: `can parse HH:MM:SS "string" format`,
			in: `12:34:56 "test string"`,
			string: "test string",
			number: 45296,
			precision: 0,
			approximate: false,
		},
		{
			name: `can parse HH:MM:SS.SSS "string" format`,
			in: `12:34:56.789 "test string"`,
			string: "test string",
			number: 45296.789,
			precision: 3,
			approximate: false,
		},
		{
			name: `can parse MM:SS "string" format`,
			in: `12:34 "test string"`,
			string: "test string",
			number: 754,
			precision: 0,
			approximate: false,
		},
		{
			name: `can parse -HH:MM:SS "string" format`,
			in: `-12:34:56 "test string"`,
			string: "test string",
			number: -45296,
			precision: 0,
			approximate: false,
		},
		{
			name: "can parse approximate minutes and seconds",
			in: "1x:3?.4X5",
			string: "1x:3?.4X5",
			number: 630.405,
			precision: 3,
			approximate: true,
		},
		{
			name: "ignores prefixes and suffixes",
			in: "zzz12:34:56zzz",
			string: "zzz12:34:56zzz",
			number: 45296,
			precision: 0,
			approximate: false,
		},
		{
			name: "trims whitespace",
			in: "   12:34:56   ",
			string: "12:34:56",
			number: 45296,
			precision: 0,
			approximate: false,
		},
		{
			name: "trims whitespace inside arbitrary string format",
			in: `   12:34:56    "  test string  "   `,
			string: "test string",
			number: 45296,
			precision: 0,
			approximate: false,
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseTimeValue(test.in);
			expect(v).toBeDefined();
			if (v) {
				expect(v.string).toBe(test.string);
				expect(v.number).toBe(test.number);
				expect(v.precision).toBe(test.precision);
				expect(v.approximate).toBe(test.approximate);
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
			in: "zzz",
		},
	].forEach((test) => {
		it(test.name, () => {
			expect(parseTimeValue(test.in)).toBeUndefined();
		});
	});
});
