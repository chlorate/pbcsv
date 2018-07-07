import {ApproxDate, parseApproxDate} from "./approx-date";
import {DatePrecision} from "./date-precision";

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
