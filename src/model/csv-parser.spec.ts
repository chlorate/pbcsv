import {CsvParser} from ".";

describe("CsvParser", () => {
	let parser;

	beforeEach(() => {
		parser = new CsvParser();
	});

	describe("parse", () => {
		it("should create categories from a single column", (done) => {
			const csv = `Category,Value
A1,0
B1 / B2,0
C1 / C2 / C3,0
C1 / C2 / C4,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 3, done.fail);
				requireLength(c[0].children, 0, done.fail);
				requireLength(c[1].children, 1, done.fail);
				requireLength(c[2].children, 1, done.fail);
				requireLength(c[2].children[0].children, 2, done.fail);

				let ch = c[0];
				expect(ch.name).toBe("A1");
				expect(ch.parent).toBeUndefined();

				ch = c[1];
				expect(ch.name).toBe("B1");
				expect(ch.parent).toBeUndefined();

				ch = c[1].children[0];
				expect(ch.name).toBe("B2");
				expect(ch.parent).toBe(c[1]);

				ch = c[2];
				expect(ch.name).toBe("C1");
				expect(ch.parent).toBeUndefined();

				ch = c[2].children[0];
				expect(ch.name).toBe("C2");
				expect(ch.parent).toBe(c[2]);

				ch = c[2].children[0].children[0];
				expect(ch.name).toBe("C3");
				expect(ch.parent).toBe(c[2].children[0]);

				ch = c[2].children[0].children[1];
				expect(ch.name).toBe("C4");
				expect(ch.parent).toBe(c[2].children[0]);

				done();
			}, done.fail);
		});

		it("should create categories from multiple columns", (done) => {
			const csv = `Game,Value,Category
G1,0,C1
G2 / G3,0,C2 / C3`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].children, 1, done.fail);
				requireLength(c[1].children, 1, done.fail);
				requireLength(c[1].children[0].children, 1, done.fail);
				requireLength(
					c[1].children[0].children[0].children,
					1,
					done.fail,
				);

				let ch = c[0];
				expect(ch.name).toBe("G1");
				expect(ch.parent).toBeUndefined();

				ch = c[0].children[0];
				expect(ch.name).toBe("C1");
				expect(ch.parent).toBe(c[0]);

				ch = c[1];
				expect(ch.name).toBe("G2");
				expect(ch.parent).toBeUndefined();

				ch = c[1].children[0];
				expect(ch.name).toBe("G3");
				expect(ch.parent).toBe(c[1]);

				ch = c[1].children[0].children[0];
				expect(ch.name).toBe("C2");
				expect(ch.parent).toBe(c[1].children[0]);

				ch = c[1].children[0].children[0].children[0];
				expect(ch.name).toBe("C3");
				expect(ch.parent).toBe(c[1].children[0].children[0]);

				done();
			}, done.fail);
		});

		it("should cascade previous category columns", (done) => {
			const csv = `Game,Category,Split,Value
G1,C1,,0
,C2,,0
,C3,C4,0
,,C5,0
,C6,,0

,,C7,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].children, 4, done.fail);
				requireLength(c[0].children[2].children, 2, done.fail);
				requireLength(c[0].children[3].children, 0, done.fail);
				requireLength(c[1].children, 0, done.fail);

				expect(c[0].name).toBe("G1");
				expect(c[0].children[0].name).toBe("C1");
				expect(c[0].children[1].name).toBe("C2");
				expect(c[0].children[2].name).toBe("C3");
				expect(c[0].children[2].children[0].name).toBe("C4");
				expect(c[0].children[2].children[1].name).toBe("C5");
				expect(c[0].children[3].name).toBe("C6");
				expect(c[1].name).toBe("C7");

				done();
			}, done.fail);
		});

		it("should strip categories with blank name", (done) => {
			const csv = `Game,Value,Category
,0,C1
G1,0,
G3 /  / G4,0,
G5 /  /        / G6,0,`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 4, done.fail);
				requireLength(c[2].children, 1, done.fail);
				requireLength(c[3].children, 1, done.fail);

				let ch = c[0];
				expect(ch.name).toBe("C1");
				expect(ch.parent).toBeUndefined();

				ch = c[1];
				expect(ch.name).toBe("G1");
				expect(ch.parent).toBeUndefined();

				ch = c[2];
				expect(ch.name).toBe("G3");
				expect(ch.parent).toBeUndefined();

				ch = c[2].children[0];
				expect(ch.name).toBe("G4");
				expect(ch.parent).toBe(c[2]);

				ch = c[3];
				expect(ch.name).toBe("G5");
				expect(ch.parent).toBeUndefined();

				ch = c[3].children[0];
				expect(ch.name).toBe("G6");
				expect(ch.parent).toBe(c[3]);

				done();
			}, done.fail);
		});

		it("should assign unambiguous slugs", (done) => {
			const csv = `Category,Value
C1 / C1,0
C1? / C1,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].children, 1, done.fail);
				requireLength(c[1].children, 1, done.fail);

				expect(c[0].fullSlug).toBe("c1");
				expect(c[0].children[0].fullSlug).toBe("c1/c1");

				expect(c[1].fullSlug).toBe("c1.2");
				expect(c[1].children[0].fullSlug).toBe("c1.2/c1");

				done();
			}, done.fail);
		});

		it("should add runs to categories", (done) => {
			const csv = `Category,Value,Main,Sum,Platform,Version,Emulator,Date,Comment,Link
Empty,0,,,,,,,,
Category,0,Value,"A,B",NES,1.1,FCEU,1987-12-17,Run 1...,http://L1
Category,1:00,Value,A,NES,1.0,FCEU,2010-03-01,Run 2...,https://L2`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].runs, 1, done.fail);
				requireLength(c[1].runs, 2, done.fail);

				let r = c[0].runs[0];
				expect(r.category).toBe(c[0]);
				expect(r.main).toBe("");
				expect(r.sums.length).toBe(0);
				expect(r.platform).toBe("");
				expect(r.version).toBe("");
				expect(r.emulator).toBe("");
				expect(r.date).toBeUndefined();
				expect(r.comment).toBe("");
				expect(r.link).toBe("");

				r = c[1].runs[0];
				expect(r.category).toBe(c[1]);
				expect(r.main).toBe("Value");
				expect(r.sums).toEqual(["A", "B"]);
				expect(r.platform).toBe("NES");
				expect(r.version).toBe("1.1");
				expect(r.emulator).toBe("FCEU");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("1987-12-17");
				expect(r.comment).toBe("Run 1...");
				expect(r.link).toBe("http://L1");

				r = c[1].runs[1];
				expect(r.category).toBe(c[1]);
				expect(r.main).toBe("Value");
				expect(r.sums).toEqual(["A"]);
				expect(r.platform).toBe("NES");
				expect(r.version).toBe("1.0");
				expect(r.emulator).toBe("FCEU");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("2010-03-01");
				expect(r.comment).toBe("Run 2...");
				expect(r.link).toBe("https://L2");

				done();
			}, done.fail);
		});

		it("should add runs to years", (done) => {
			const csv = `Category,Value,Date
C1,0,2017
C1,0,
C1,0,2018
C1,0,2018-10-02`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const y = parser.years;
				requireLength(y, 3, done.fail);

				expect(y[0].name).toBe("2018");
				requireLength(y[0].runs, 2, done.fail);
				requireDefined(y[0].runs[0].date, done.fail);
				expect(y[0].runs[0].date.string).toBe("2018-10-02");
				requireDefined(y[0].runs[1].date, done.fail);
				expect(y[0].runs[1].date.string).toBe("2018");

				expect(y[1].name).toBe("2017");
				requireLength(y[1].runs, 1, done.fail);
				requireDefined(y[1].runs[0].date, done.fail);
				expect(y[1].runs[0].date.string).toBe("2017");

				expect(y[2].name).toBe("Unknown");
				requireLength(y[2].runs, 1, done.fail);
				expect(y[2].runs[0].date).toBeUndefined();

				done();
			}, done.fail);
		});

		it("should add values to runs", (done) => {
			const csv = `Category,Score,Time,Value
C1,1234,,
C1,,1:23:45,
C1,,,String
C1,1,2,3`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].runs, 4, done.fail);

				let v = c[0].runs[0].values;
				expect(Object.keys(v).length).toBe(1);
				expect(v.Score).toBeDefined();

				v = c[0].runs[1].values;
				expect(Object.keys(v).length).toBe(1);
				expect(v.Time).toBeDefined();

				v = c[0].runs[2].values;
				expect(Object.keys(v).length).toBe(1);
				expect(v.Value).toBeDefined();

				v = c[0].runs[3].values;
				expect(Object.keys(v).length).toBe(3);
				expect(v.Score).toBeDefined();
				expect(v.Time).toBeDefined();
				expect(v.Value).toBeDefined();

				done();
			}, done.fail);
		});

		it("should trim whitespace", (done) => {
			const csv = `Category,Value,Main,Sum,Platform,Version,Emulator,Date,Comment,Link
 C1  /  C2 , V , Value ," A , , B ", P , V , E , 1987-11-17 , C , http://L `;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].children, 1, done.fail);

				expect(c[0].name).toBe("C1");
				expect(c[0].children[0].name).toBe("C2");

				const r = c[0].children[0].runs[0];
				expect(r.values.Value.string).toBe("V");
				expect(r.main).toBe("Value");
				expect(r.sums).toEqual(["A", "B"]);
				expect(r.platform).toBe("P");
				expect(r.version).toBe("V");
				expect(r.emulator).toBe("E");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("1987-11-17");
				expect(r.comment).toBe("C");
				expect(r.link).toBe("http://L");

				done();
			}, done.fail);
		});

		it("should ignore empty/unrecognized rows before header", (done) => {
			const csv = `,

Not a header,
,

Category,Value
Category,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);
				expect(parser.categories.length).toBe(1);
				done();
			}, done.fail);
		});

		it("should ignore duplicate header rows", (done) => {
			const csv = `Category,Value,Main,Sum,Platform,Version,Emulator,Date,Comment,Link
C1,0,,,,,,,,
Category,Value,Main,Sum,Platform,Version,Emulator,Date,Comment,Link
C2,0,,,,,,,,`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);
				expect(parser.categories.length).toBe(2);
				done();
			}, done.fail);
		});

		it("should use first column found for single-only columns", (done) => {
			const csv = `Category,Value,Platform,Plat,Version,Ver,Emulator,Emu,Date 1,Date 2,Comment,Notes
C1,0,P,,V,,E,,D,,C,`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(1);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].runs, 1, done.fail);

				const r = c[0].runs[0];
				expect(r.platform).toBe("P");
				expect(r.version).toBe("V");
				expect(r.emulator).toBe("E");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("D");
				expect(r.comment).toBe("C");

				done();
			});
		});

		it("should ignore rows with no categories (after cascade)", (done) => {
			const csv = `Category,Value
,

,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);
				expect(parser.categories.length).toBe(0);
				done();
			}, done.fail);
		});

		it("should ignore rows with no values", (done) => {
			const csv = `Category,Value 1,Value 2
,,

Category,,`;

			parser.parse(csv).then(() => {
				const c = parser.categories;
				requireLength(c, 0, done.fail);
				done();
			}, done.fail);
		});

		it("should warn if a main value is not a value column", (done) => {
			const csv = `Category,RTA,IGT,Main
Category,0,0,Unknown`;

			parser.parse(csv).then(() => {
				expect(parser.errors.length).toBe(0);
				expect(parser.warnings).toEqual([
					"Row 2: Main is not a name of a value column: Unknown",
				]);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].runs, 1, done.fail);
				expect(c[0].runs[0].main).toBe("");

				done();
			}, done.fail);
		});

		it("should warn about any date issues", (done) => {
			const csv = `Category,Value,Date
Category,0,Unknown
Category,0,1/2/2003
Category,0,1/2/2003`;

			parser.parse(csv).then(() => {
				expect(parser.errors.length).toBe(0);
				expect(parser.warnings).toEqual([
					"Row 2: Unrecognized date: Unknown",
					"Row 3: Assuming date format is MM/DD/YYYY, not DD/MM/YYYY.",
				]);
				requireLength(parser.categories, 1, done.fail);
				requireLength(parser.categories[0].runs, 3, done.fail);
				done();
			}, done.fail);
		});

		it("should warn about invalid URLs", (done) => {
			const csv = `Category,Value,Link
Category,0,bad`;

			parser.parse(csv).then(() => {
				expect(parser.errors.length).toBe(0);
				expect(parser.warnings).toEqual([
					"Row 2: Invalid link URL: bad",
				]);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].runs, 1, done.fail);
				expect(c[0].runs[0].link).toBe("");

				done();
			}, done.fail);
		});

		it("should reject promise on any CSV parsing error", (done) => {
			const csv = `Category,Value
bad`;

			parser.parse(csv).then(done.fail, () => {
				expect(parser.errors).toEqual([
					"Error: Number of columns is inconsistent on line 2",
				]);
				done();
			});
		});

		it("should reject promise if there are no category columns", (done) => {
			const csv = `Value`;

			parser.parse(csv).then(done.fail, () => {
				expect(parser.errors).toEqual(["No category columns found."]);
				done();
			});
		});

		it("should reject promise if there are no value columns", (done) => {
			const csv = "Category";

			parser.parse(csv).then(done.fail, () => {
				expect(parser.errors).toEqual(["No value columns found."]);
				done();
			});
		});
	});
});

function requireLength(
	array: any[],
	length: number,
	fail: (message: string) => void,
) {
	expect(array.length).toBe(length);
	if (array.length < length) {
		fail(`Expected array to have length ${length}: ${array}`);
	}
}

function requireDefined(value: any, fail: (message: string) => void) {
	expect(value).toBeDefined();
	if (value === undefined) {
		fail("Expected value to be defined");
	}
}
