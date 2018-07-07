import {ApproxDate, parseApproxDate} from "./approx-date";
import {DatePrecision} from "./date-precision";

describe("ApproxDate", () => {
	it("returns a copy of its date", () => {
		const d = new ApproxDate("", new Date(1987, 11, 17), DatePrecision.Day);
		d.date.setFullYear(2018);
		expect(d.date.getFullYear()).toBe(1987);
	});

	describe("daysSince", () => {
		beforeEach(() => {
			jasmine.clock().install();
			jasmine.clock().mockDate(new Date(1987, 11, 17, 1, 2, 3, 4));
		});

		afterEach(() => {
			jasmine.clock().uninstall();
		});

		it("should return exact days for day precision", () => {
			const d = new ApproxDate(
				"",
				new Date(1987, 11, 10),
				DatePrecision.Day,
			);
			expect(d.daysSince).toBe(7);
		});

		it("should return undefined if day precision and in the future", () => {
			const d = new ApproxDate(
				"",
				new Date(2018, 1, 2),
				DatePrecision.Day,
			);
			expect(d.daysSince).toBeUndefined();
		});

		it("should return days since month end for month precision", () => {
			const d = new ApproxDate(
				"",
				new Date(1987, 10, 1),
				DatePrecision.Month,
			);
			expect(d.daysSince).toBe(17);
		});

		it("should return undefined if month precision and same month", () => {
			const d = new ApproxDate(
				"",
				new Date(1987, 11, 1),
				DatePrecision.Month,
			);
			expect(d.daysSince).toBeUndefined();
		});

		it("should returns days since year end for year precision", () => {
			const d = new ApproxDate(
				"",
				new Date(1986, 0, 1),
				DatePrecision.Year,
			);
			expect(d.daysSince).toBe(351);
		});

		it("should return undefined if year precision and same year", () => {
			const d = new ApproxDate(
				"",
				new Date(1987, 0, 1),
				DatePrecision.Year,
			);
			expect(d.daysSince).toBeUndefined();
		});
	});
});

describe("parseApproxDate", () => {
	it("can parse YYYY format", () => {
		const got = parseApproxDate("1987");
		check(got, "1987", 1987, 0, 1, DatePrecision.Year);
	});

	it("can parse YYYY-MM format", () => {
		const got = parseApproxDate("1987-12");
		check(got, "1987-12", 1987, 11, 1, DatePrecision.Month);
	});

	it("can parse YYYY-MM-DD format", () => {
		const got = parseApproxDate("1987-12-17");
		check(got, "1987-12-17", 1987, 11, 17, DatePrecision.Day);
	});

	it("can parse YYYY/MM/DD format", () => {
		const got = parseApproxDate("1987/12/17");
		check(got, "1987/12/17", 1987, 11, 17, DatePrecision.Day);
	});

	it("ignores extra text", () => {
		const got = parseApproxDate("? 1987-12-17 ?");
		check(got, "? 1987-12-17 ?", 1987, 11, 17, DatePrecision.Day);
	});

	it("trims whitespace", () => {
		const got = parseApproxDate("   1987-12-17   ");
		check(got, "1987-12-17", 1987, 11, 17, DatePrecision.Day);
	});

	it("returns undefined if parsing fails", () => {
		expect(parseApproxDate("???")).toBeUndefined();
	});

	function check(
		d: ApproxDate | undefined,
		s: string,
		year: number,
		month: number,
		day: number,
		p: DatePrecision,
	) {
		expect(d).not.toBeUndefined();
		if (d) {
			expect(d.string).toBe(s);
			expect(d.date).toEqual(new Date(year, month, day));
			expect(d.precision).toBe(p);
		}
	}
});
