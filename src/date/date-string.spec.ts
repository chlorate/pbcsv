import {DateString, parseDate} from "./date-string";

describe("DateString", () => {
	describe("parse", () => {
		it("can parse YYYY format", () => {
			const want = new DateString("1987", new Date(1987, 0, 1));
			expect(parseDate("1987")).toEqual(want);
		});

		it("can parse YYYY-MM format", () => {
			const want = new DateString("1987-12", new Date(1987, 11, 1));
			expect(parseDate("1987-12")).toEqual(want);
		});

		it("can parse YYYY-MM-DD format", () => {
			const want = new DateString("1987-12-17", new Date(1987, 11, 17));
			expect(parseDate("1987-12-17")).toEqual(want);
		});

		it("can parse YYYY/MM/DD format", () => {
			const want = new DateString("1987/12/17", new Date(1987, 11, 17));
			expect(parseDate("1987/12/17")).toEqual(want);
		});

		it("ignores extra text", () => {
			const want = new DateString(
				"? 1987-12-17 ?",
				new Date(1987, 11, 17),
			);
			expect(parseDate("? 1987-12-17 ?")).toEqual(want);
		});

		it("trims whitespace", () => {
			const want = new DateString("1987-12-17", new Date(1987, 11, 17));
			expect(parseDate("   1987-12-17   ")).toEqual(want);
		});
	});
});
