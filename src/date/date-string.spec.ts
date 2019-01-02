import {DatePrecision, DateString, parseDateString} from "pbcsv/date";

describe("DateString", () => {
	describe("approximate", () => {
		[
			{
				precision: undefined,
				expected: false,
			},
			{
				precision: DatePrecision.Year,
				expected: true,
			},
			{
				precision: DatePrecision.Month,
				expected: true,
			},
			{
				precision: DatePrecision.Day,
				expected: false,
			},
		].forEach(({precision, expected}) => {
			it(`should return ${expected} when precision is ${precision}`, () => {
				const dateString = new DateString({precision});
				expect(dateString.approximate).toBe(expected);
			});
		});
	});

	describe("daysAgo", () => {
		beforeEach(() => {
			jasmine.clock().install();
			jasmine.clock().mockDate(new Date(1987, 11, 17, 1, 2, 3, 4));
		});

		afterEach(() => {
			jasmine.clock().uninstall();
		});

		it("should return exact days for day precision", () => {
			const d = new DateString({
				date: new Date(1987, 11, 10),
				precision: DatePrecision.Day,
			});
			expect(d.daysAgo).toBe(7);
		});

		it("should return undefined if day precision and in the future", () => {
			const d = new DateString({
				date: new Date(2018, 1, 2),
				precision: DatePrecision.Day,
			});
			expect(d.daysAgo).toBeUndefined();
		});

		it("should return days since month end for month precision", () => {
			const d = new DateString({
				date: new Date(1987, 10, 1),
				precision: DatePrecision.Month,
			});
			expect(d.daysAgo).toBe(17);
		});

		it("should return undefined if month precision and same month", () => {
			const d = new DateString({
				date: new Date(1987, 11, 1),
				precision: DatePrecision.Month,
			});
			expect(d.daysAgo).toBeUndefined();
		});

		it("should returns days since year end for year precision", () => {
			const d = new DateString({
				date: new Date(1986, 0, 1),
				precision: DatePrecision.Year,
			});
			expect(d.daysAgo).toBe(351);
		});

		it("should return undefined if year precision and same year", () => {
			const d = new DateString({
				date: new Date(1987, 0, 1),
				precision: DatePrecision.Year,
			});
			expect(d.daysAgo).toBeUndefined();
		});

		it("should return undefined if no date", () => {
			const d = new DateString();
			expect(d.daysAgo).toBeUndefined();
		});
	});

	describe("iso8601", () => {
		const date = new Date(2018, 2, 4);

		it("should return YYYY for year precision", () => {
			const d = new DateString({date, precision: DatePrecision.Year});
			expect(d.iso8601).toBe("2018");
		});

		it("should return YYYY-MM for month precision", () => {
			const d = new DateString({date, precision: DatePrecision.Month});
			expect(d.iso8601).toBe("2018-03");
		});

		it("should return YYYY-MM-DD for day precision", () => {
			const d = new DateString({date, precision: DatePrecision.Day});
			expect(d.iso8601).toBe("2018-03-04");
		});

		it("should return empty string if no date", () => {
			const d = new DateString();
			expect(d.iso8601).toBe("");
		});
	});
});

describe("parseDateString", () => {
	[
		{
			name: "can parse YYYY format",
			in: "1987",
			string: "1987",
			date: new Date(1987, 0, 1),
			precision: DatePrecision.Year,
		},
		{
			name: "can parse YYYY-MM format",
			in: "1987-12",
			string: "1987-12",
			date: new Date(1987, 11, 1),
			precision: DatePrecision.Month,
		},
		{
			name: "can parse YYYY/MM format",
			in: "1987/12",
			string: "1987/12",
			date: new Date(1987, 11, 1),
			precision: DatePrecision.Month,
		},
		{
			name: "can parse YYYY-MM-DD format",
			in: "1987-12-17",
			string: "1987-12-17",
			date: new Date(1987, 11, 17),
			precision: DatePrecision.Day,
		},
		{
			name: "can parse YYYY/MM/DD format",
			in: "1987/12/17",
			string: "1987/12/17",
			date: new Date(1987, 11, 17),
			precision: DatePrecision.Day,
		},
		{
			name: "can parse MM-DD-YYYY format",
			in: "12-17-1987",
			string: "12-17-1987",
			date: new Date(1987, 11, 17),
			precision: DatePrecision.Day,
		},
		{
			name: "can parse MM/DD/YYYY format",
			in: "12/17/1987",
			string: "12/17/1987",
			date: new Date(1987, 11, 17),
			precision: DatePrecision.Day,
		},
		{
			name: "can parse MM-DD-YY format",
			in: "10-02-18",
			string: "10-02-18",
			date: new Date(2018, 9, 2),
			precision: DatePrecision.Day,
		},
		{
			name: "can parse MM/DD/YY format",
			in: "10/02/18",
			string: "10/02/18",
			date: new Date(2018, 9, 2),
			precision: DatePrecision.Day,
		},
		{
			name: "can parse MM-YYYY format",
			in: "12-1987",
			string: "12-1987",
			date: new Date(1987, 11, 1),
			precision: DatePrecision.Month,
		},
		{
			name: "can parse MM/YYYY format",
			in: "12/1987",
			string: "12/1987",
			date: new Date(1987, 11, 1),
			precision: DatePrecision.Month,
		},
		{
			name: "can parse string only",
			in: "string",
			string: "string",
		},
		{
			name: "can parse empty string",
			in: "",
			string: "",
		},
		{
			name: "ignores extra text",
			in: "???1987-12-17???",
			string: "???1987-12-17???",
			date: new Date(1987, 11, 17),
			precision: DatePrecision.Day,
		},
		{
			name: "trims whitespace",
			in: "   1987-12-17   ",
			string: "1987-12-17",
			date: new Date(1987, 11, 17),
			precision: DatePrecision.Day,
		},
	].forEach((test) => {
		it(test.name, () => {
			const d = parseDateString(test.in);
			expect(d).toBeDefined();
			if (d) {
				expect(d.string).toBe(test.string);
				expect(d.date).toEqual(test.date);
				expect(d.precision).toBe(test.precision);
			}
		});
	});
});
